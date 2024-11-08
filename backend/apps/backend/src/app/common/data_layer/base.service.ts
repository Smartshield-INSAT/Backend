/* eslint-disable @typescript-eslint/no-explicit-any */
import { Timestamp } from '../base_class/timestamp.entity';
import { Filtering } from '../decorators/query/filtering.params.decorator';
import { Pagination } from '../decorators/query/pagination.params.decorator';
import { Sorting } from '../decorators/query/sorting.params.decorator';
import { NestedRelations } from '../utils/nested.keys.extractor';

import { PaginatedResource } from './paginated.ressource.dto';
import { getOrder, getWhere } from './typeorm.helper.functions';

import { defer, from, map, Observable } from 'rxjs';
import {
    DeepPartial,
    FindManyOptions,
    FindOneOptions,
    FindOptionsOrder,
    FindOptionsRelations,
    FindOptionsWhere,
    FindOptionsWhereProperty,
    ObjectId,
    QueryRunner,
    Repository,
    UpdateResult,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

/**
 * Abstract BaseService class to provide common CRUD operations for entities.
 * Utilizes RxJS Observables for handling asynchronous operations.
 *
 * @template T - The entity type that extends Timestamp and contains an id.
 */
export abstract class BaseService<T extends Timestamp> {
    constructor(protected readonly repository: Repository<T>) {}

    /**
     * Creates an entity instance in memory. The entity must be saved to persist in the database.
     *
     * @param entity - A partial entity object of type T.
     * @returns An Observable that emits the created entity.
     */
    create(entity: DeepPartial<T>): Observable<T> {
        return defer(() => Promise.resolve(this.repository.create(entity)));
    }

    /**
     * Saves an entity to the database. If the entity already exists, it updates it; otherwise, it inserts a new record.
     *
     * @param entity - A partial entity object of type T.
     * @returns An Observable that emits the saved entity.
     */
    save(entity: DeepPartial<T>): Observable<T> {
        return defer(() => this.repository.save(entity));
    }

    /**
     * Saves multiple entities to the database. If an entity already exists, it updates it; otherwise, it inserts a new record.
     *
     * @param entities - An array of partial entity objects of type T.
     * @returns An Observable that emits the array of saved entities.
     */
    saveMany(entities: DeepPartial<T>[]): Observable<T[]> {
        return defer(() => this.repository.save(entities));
    }

    /**
     * Updates an entity in the database based on the provided criteria.
     *
     * @param id - The identifier or criteria for the entity to update.
     * @param entity - The partial entity object containing fields to update.
     * @returns An Observable that emits the result of the update operation.
     */
    update(
        id: number | string | FindOptionsWhere<T>,
        entity: QueryDeepPartialEntity<T>,
    ): Observable<UpdateResult> {
        return defer(() => this.repository.update(id, entity));
    }

    /**
     * Counts the total number of entities in the database.
     *
     * @returns An Observable that emits the total count of entities.
     */
    count(): Observable<number> {
        return defer(() => this.repository.count());
    }

    /**
     * Saves multiple entities within a transaction.
     *
     * @param entities - An array of partial entity objects of type T.
     * @param queryRunner - The QueryRunner instance to manage the transaction.
     * @returns An Observable that emits the array of saved entities.
     */
    saveManyInTransaction(entities: DeepPartial<T>[], queryRunner: QueryRunner): Observable<T[]> {
        return from(queryRunner.manager.save(this.repository.target, entities as DeepPartial<T>[])).pipe(
            map((savedEntities: T[]) => {
                return savedEntities.map((entity) => ({
                    ...entity,
                    deleted_at: null,
                }));
            }),
        );
    }

    /**
     * Saves an entity within a transaction, ensuring uniqueness by checking unique constraints.
     *
     * @param entity - A partial entity object of type T with an 'id' property.
     * @param queryRunner - The QueryRunner instance to manage the transaction.
     * @returns An Observable that emits the saved entity.
     */
    saveInTransaction(entity: DeepPartial<T>, queryRunner: QueryRunner): Observable<T> {
        return defer(() => this.checkUniquenessAndSave(entity, queryRunner));
    }

    /**
     * Checks for unique constraints on the entity and saves it within a transaction.
     * This method specifically requires that the entity type T has an 'id' property of type string or number.
     *
     * @param entity - A partial entity object of type T.
     * @param queryRunner - The QueryRunner instance to manage the transaction.
     * @returns A Promise that resolves to the saved entity.
     * @throws Error if an entity with unique constraints already exists.
     */
    private async checkUniquenessAndSave(entity: DeepPartial<T>, queryRunner: QueryRunner): Promise<T> {
        const repo = queryRunner.manager.getRepository(this.repository.target);
        const metadata = repo.metadata;

        // Retrieve all unique constraints defined on the entity
        const uniqueConstraints = metadata.uniques;

        for (const constraint of uniqueConstraints) {
            const whereClauses: FindOptionsWhere<T>[] = [];
            let allFieldsPresent = true;

            for (const field of constraint.columns) {
                const fieldName = field.propertyName as keyof T;
                const fieldValue = (entity as Partial<T>)[fieldName]; // Safely access entity field values

                if (fieldValue !== undefined && fieldValue !== null) {
                    // Ensure the type is compatible with FindOptionsWhereProperty
                    const convertedValue = this.toFindOptionsWhereProperty(fieldValue);

                    if (convertedValue === undefined) {
                        allFieldsPresent = false;
                        break;
                    } else {
                        // Correctly define the newWhereClause as FindOptionsWhere<T>
                        const newWhereClause: FindOptionsWhere<T> = {
                            [fieldName]: convertedValue,
                        } as FindOptionsWhere<T>;
                        whereClauses.push(newWhereClause);
                    }
                } else {
                    allFieldsPresent = false;
                    break;
                }
            }

            // If all fields of the constraint are present in the entity, check for existence
            if (allFieldsPresent) {
                // Use OR condition if there are multiple where clauses
                const existingEntity = await repo.findOne({
                    where: whereClauses.length > 1 ? whereClauses : whereClauses[0],
                    withDeleted: true,
                });

                if (existingEntity) {
                    if (
                        'deleted_at' in existingEntity &&
                        existingEntity.deleted_at !== null &&
                        'id' in existingEntity
                    ) {
                        await repo.restore({ id: existingEntity.id } as FindOptionsWhere<T>);
                        Object.assign(existingEntity, entity);
                        return repo.save(existingEntity);
                    } else {
                        throw new Error(
                            `Entity with these unique constraints already exists: ${constraint.columns
                                .map((c) => c.propertyName)
                                .join(', ')}`,
                        );
                    }
                }
            }
        }

        return repo.save(entity as T);
    }

    /**
     * Converts a value to a FindOptionsWhereProperty type, ensuring type safety.
     *
     * @param value - The value to convert.
     * @returns The value converted to a FindOptionsWhereProperty type, or undefined if not compatible.
     */
    private toFindOptionsWhereProperty<V>(
        value: V,
    ): FindOptionsWhereProperty<NonNullable<V>, NonNullable<V>> | undefined {
        if (value === null || value === undefined) {
            return undefined;
        }

        if (
            typeof value === 'boolean' ||
            typeof value === 'number' ||
            typeof value === 'string' ||
            (typeof value === 'object' && !Array.isArray(value))
        ) {
            return value as unknown as FindOptionsWhereProperty<NonNullable<V>, NonNullable<V>>;
        }

        return undefined; // Fallback to undefined if not compatible
    }

    /**
     * Updates an entity within a transaction.
     *
     * @param id - The identifier or criteria for the entity to update.
     * @param entity - The partial entity object containing fields to update.
     * @param queryRunner - The QueryRunner instance to manage the transaction.
     * @returns An Observable that emits the result of the update operation.
     */
    updateInTransaction(
        id: number | string | FindOptionsWhere<T>,
        entity: QueryDeepPartialEntity<T>,
        queryRunner: QueryRunner,
    ): Observable<UpdateResult> {
        return defer(() => queryRunner.manager.getRepository(this.repository.target).update(id, entity));
    }

    /**
     * Finds a single entity by ID or other criteria, with support for nested relations.
     *
     * @param options - The options for finding the entity.
     * @param relations - Nested relations to include.
     * @returns An Observable that emits the found entity or null if not found.
     */
    findOne(options: FindOneOptions<T>, relations?: NestedRelations<T>): Observable<T | null> {
        const mergedOptions: FindOneOptions<T> = this.mergeRelations(options, relations);
        return defer(() => from(this.repository.findOne(mergedOptions)));
    }

    /**
     * Finds all entities based on the provided options, with support for nested relations.
     *
     * @param options - The options to use when finding entities.
     * @param relations - Nested relations to include.
     * @returns An Observable that emits an array of found entities.
     */
    findAll(options?: FindManyOptions<T>, relations?: NestedRelations<T>): Observable<T[]> {
        const mergedOptions: FindManyOptions<T> = this.mergeRelations(options || {}, relations);
        return defer(() => from(this.repository.find(mergedOptions)));
    }

    /**
     * Merges the provided options with parsed nested relations.
     *
     * @param options - The original find options.
     * @param relations - Nested relations to include.
     * @returns Merged find options with relations.
     */
    private mergeRelations<O extends FindOneOptions<T> | FindManyOptions<T>>(
        options: O,
        relations?: NestedRelations<T>,
    ): O {
        if (!relations) {
            return options;
        }

        const parsedRelations = this.parseRelations(relations);
        const existingRelations = options.relations || {};

        return {
            ...options,
            relations: this.mergeRelationObjects(
                existingRelations as FindOptionsRelations<T>,
                parsedRelations,
            ),
        };
    }

    /**
     * Parses the nested relations object into a flat object of relation paths.
     *
     * @param relations - The nested relations object.
     * @returns An object of relation paths.
     */
    private parseRelations(relations: NestedRelations<T>): FindOptionsRelations<T> {
        const result: FindOptionsRelations<T> = {};

        const traverse = (object: NestedRelations<T>, prefix: string[] = []): void => {
            for (const [key, value] of Object.entries(object)) {
                const newPrefix = [...prefix, key];
                const relationPath = newPrefix.join('.') as keyof FindOptionsRelations<T>;

                if (value === true) {
                    result[relationPath] = true as any;
                } else if (typeof value === 'object') {
                    result[relationPath] = true as any;
                    traverse(value as NestedRelations<T>, newPrefix);
                }
            }
        };

        traverse(relations);
        return result;
    }

    /**
     * Merges two relation objects.
     *
     * @param obj1 - The first relation object.
     * @param obj2 - The second relation object.
     * @returns Merged relation object.
     */
    private mergeRelationObjects(
        object1: FindOptionsRelations<T>,
        object2: FindOptionsRelations<T>,
    ): FindOptionsRelations<T> {
        const result: FindOptionsRelations<T> = { ...object1 };

        for (const [key, value] of Object.entries(object2) as [keyof FindOptionsRelations<T>, boolean][]) {
            if (key in result) {
                result[key] =
                    typeof result[key] === 'object' && typeof value === 'object'
                        ? (this.mergeRelationObjects(
                              result[key] as FindOptionsRelations<T>,
                              value as FindOptionsRelations<T>,
                          ) as any)
                        : (value as any);
            } else {
                result[key] = value as any;
            }
        }
        return result;
    }

    /**
     * Increments or decrements a specific field of an entity by a given value.
     *
     * @param entity - The criteria to select the entity.
     * @param field - The field to increment or decrement.
     * @param incremental - The value to increment or decrement by (default is 1).
     * @returns An Observable that emits the result of the increment operation.
     */
    increment(entity: FindOptionsWhere<T>, field: string, incremental = 1): Observable<UpdateResult> {
        return defer(() => this.repository.increment(entity, field, incremental));
    }

    /**
     * Soft deletes an entity based on the provided criteria.
     *
     * @param criteria - The criteria to select the entity to delete.
     * @returns An Observable that emits the result of the delete operation.
     */
    remove(
        criteria: string | number | Date | ObjectId | string[] | number[] | FindOptionsWhere<T>,
    ): Observable<UpdateResult> {
        return defer(() => this.repository.softDelete(criteria));
    }

    /**
     * Soft deletes an entity within a transaction.
     *
     * @param entity - The entity to delete.
     * @param queryRunner - The QueryRunner instance to manage the transaction.
     * @returns An Observable that emits the result of the delete operation.
     */
    removeInTransaction(entity: T, queryRunner: QueryRunner): Observable<any> {
        return defer(() => queryRunner.manager.getRepository(this.repository.target).softRemove(entity));
    }

    /**
     * Paginates through the entities in the database with optional filtering and nested relations.
     *
     * @param {Pagination} options - The pagination options including page, limit, size, and offset.
     * @param {FindOptionsWhere<T>} [where] - Optional where conditions to filter the entities.
     * @param {NestedRelations<T>} [relations] - Optional nested relations to include.
     * @returns {Observable<PaginatedResource<DeepPartial<T>>>} - An Observable that emits the paginated results.
     */
    paginate(
        options: Pagination,
        where?: FindOptionsWhere<T>,
        relations?: NestedRelations<T>,
    ): Observable<PaginatedResource<DeepPartial<T>>> {
        const { page, limit, size, offset } = options;
        const parsedRelations = relations ? this.parseRelations(relations) : {};

        return defer(() =>
            from(
                this.repository.findAndCount({
                    where: where ? where : {},
                    take: limit,
                    skip: offset,
                    relations: parsedRelations,
                }),
            ).pipe(
                map((value: [T[], number]) => ({
                    totalItems: value[1],
                    items: value[0],
                    page,
                    size,
                })),
            ),
        );
    }

    /**
     * Handles advanced queries with sorting, filtering, pagination, and nested relations.
     *
     * @param pagination - The pagination options.
     * @param sort - Sorting options.
     * @param filters - Filtering options.
     * @param relations - Nested relations to include.
     * @param searchWhere - Optional search conditions for properties that are arrays.
     * @returns An Observable that emits the paginated and filtered results.
     */
    advancedQuery(
        { page, limit, size, offset }: Pagination,
        sort?: Sorting<T>,
        filters?: Filtering<T>[],
        relations?: NestedRelations<T>,
        searchWhere?: FindOptionsWhere<T>,
    ): Observable<PaginatedResource<DeepPartial<T>>> {
        const baseWhere = filters && filters.length > 0 ? getWhere<T>(filters, this.repository) : {};
        const where: FindOptionsWhere<T> | FindOptionsWhere<T>[] = searchWhere
            ? Array.isArray(baseWhere)
                ? baseWhere.map((condition) => ({ ...condition, ...searchWhere }))
                : { ...baseWhere, ...searchWhere }
            : baseWhere;

        const order: FindOptionsOrder<T> = sort ? getOrder<T>(sort) : {};

        const sortRelations = sort ? sort.property.split('.') : [];
        const mergedRelations = mergeRelations<T>(
            (relations || {}) as FindOptionsRelations<T>,
            sortRelations,
        );

        return defer(() =>
            from(
                this.repository.findAndCount({
                    where,
                    order,
                    take: limit,
                    skip: offset,
                    relations: mergedRelations,
                }),
            ).pipe(
                map(([items, totalItems]: [T[], number]) => ({
                    totalItems,
                    items,
                    page,
                    size,
                })),
            ),
        );
    }
}

/**
 * Merges existing relations with those derived from sorting, preserving nested structure.
 *
 * @param existingRelations - The relations that were passed in.
 * @param sortRelations - The relations derived from sorting, already split by '.'.
 * @returns Merged relations object.
 */
function mergeRelations<T>(
    existingRelations: FindOptionsRelations<T>,
    sortRelations: string[],
): FindOptionsRelations<T> {
    const result: FindOptionsRelations<T> = { ...existingRelations };

    let currentLevel: Record<string, any> = result;
    const newSortRelations = sortRelations.slice(0, -1);

    for (const [index, part] of newSortRelations.entries()) {
        if (index === newSortRelations.length - 1) {
            currentLevel[part] = true; // Set last part to true
        } else {
            if (!currentLevel[part]) {
                currentLevel[part] = {};
            }
            currentLevel = currentLevel[part] as Record<string, any>;
        }
    }
    return result;
}
