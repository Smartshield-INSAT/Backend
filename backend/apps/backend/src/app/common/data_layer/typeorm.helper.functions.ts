/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { Filtering, FilterRule } from '../decorators/query/filtering.params.decorator';
import { Sorting } from '../decorators/query/sorting.params.decorator';
import { NestedKeys } from '../utils/nested.keys.extractor';

import {
    BaseEntity,
    EntityMetadata,
    Equal,
    FindOperator,
    FindOptionsOrder,
    FindOptionsWhere,
    ILike,
    In,
    IsNull,
    LessThan,
    LessThanOrEqual,
    MoreThan,
    MoreThanOrEqual,
    Not,
    Repository,
} from 'typeorm';

/**
 * Generates a TypeORM `FindOptionsOrder` object based on the provided sorting criteria.
 * Supports sorting by any property, including relational properties and enums.
 *
 * @template E - The entity type extending `BaseEntity`.
 * @param {Sorting<E>} sort - The sorting parameters, including property and direction.
 * @returns {FindOptionsOrder<E>} - The order options for TypeORM queries.
 */
export function getOrder<E extends BaseEntity>(sort: Sorting<E>): FindOptionsOrder<E> {
    if (!sort) return {};

    const keys = sort.property.split('.') as string[];
    const direction = sort.direction.toLowerCase() as 'asc' | 'desc';

    // Helper function to create nested object
    const createNestedObject = (keys: string[], value: 'asc' | 'desc'): any => {
        const lastKey = keys.pop();
        if (lastKey === undefined) {
            return value;
        }
        return keys.reduceRight<Record<string, any>>((nested, key) => ({ [key]: nested }), {
            [lastKey]: value,
        });
    };

    return createNestedObject(keys, direction) as FindOptionsOrder<E>;
}

/**
 * Generates a TypeORM `FindOptionsWhere` object based on the provided filtering criteria.
 * Supports multiple filters on the same property using OR conditions.
 *
 * @template E - The entity type extending `BaseEntity`.
 * @param {Filtering<E>[]} filters - An array of filter objects containing property, rule, and value.
 * @param {Repository<E>} repository - The TypeORM repository used for fetching entity metadata.
 * @returns {FindOptionsWhere<E>} - The where options for TypeORM queries.
 */
export function getWhere<E extends BaseEntity>(
    filters: Filtering<E>[],
    repository: Repository<E>,
): FindOptionsWhere<E> {
    if (!filters || filters.length === 0) {
        return {};
    }

    const whereCondition: FindOptionsWhere<E> = {};
    const entityMetadata: EntityMetadata = repository.metadata;

    // Group filters by property
    const filtersByProperty: Record<NestedKeys<E>, Filtering<E>[]> = filters.reduce((acc, filter) => {
        if (!filter) return acc;
        const property = filter.property;
        if (!acc[property]) {
            acc[property] = [];
        }
        acc[property].push(filter);
        return acc;
    }, {} as Record<NestedKeys<E>, Filtering<E>[]>);

    // Process each property with its respective filters
    for (const [property, propertyFilters] of Object.entries(filtersByProperty) as [
        NestedKeys<E>,
        Filtering<E>[],
    ][]) {
        const keys = property.split('.');
        const propertyType = getNestedPropertyType(entityMetadata, keys);

        if (propertyFilters.length > 1) {
            // Handle multiple filters on the same property using OR conditions
            const orConditions = propertyFilters.map((filter) => buildWhereCondition(filter, propertyType));
            setNestedProperty(whereCondition, keys, orConditions);
        } else {
            // Single filter on the property
            const condition = buildWhereCondition(propertyFilters[0], propertyType);
            setNestedProperty(whereCondition, keys, condition);
        }
    }

    return whereCondition;
}

/**
 * Retrieves the type of a nested property from the entity metadata.
 *
 * @param {EntityMetadata} metadata - The metadata of the entity.
 * @param {string[]} keys - The nested keys of the property.
 * @returns {string} - The type of the property ('string', 'number', etc.).
 */
function getNestedPropertyType(metadata: EntityMetadata, keys: string[]): string {
    let currentMetadata: EntityMetadata | undefined = metadata;

    for (let index = 0; index < keys.length; index++) {
        if (!currentMetadata) break;
        const property = keys[index];

        const column = currentMetadata.findColumnWithPropertyName(property);
        const relation = currentMetadata.findRelationWithPropertyPath(property);

        if (column) {
            if (index === keys.length - 1) {
                return column.type as string;
            }
        } else if (relation) {
            currentMetadata = relation.inverseEntityMetadata;
        } else {
            console.warn(`Property ${property} not found in entity metadata`);
            return 'string';
        }
    }

    return 'string';
}

/**
 * Builds a condition based on a single filter rule and value, supporting enums.
 *
 * @template E - The entity type extending `BaseEntity`.
 * @param {Filtering<E>} filter - The filter object containing property, rule, and value.
 * @param {string | Function} propertyType - The type of the property being filtered.
 * @returns {FindOptionsWhere<E[keyof E]> | FindOperator<E[keyof E]>}
 *          - The condition to be applied in TypeORM's where clause.
 */
function buildWhereCondition<E extends BaseEntity>(
    filter: Filtering<E>,
    propertyType: string | Function,
): FindOptionsWhere<E[keyof E]> | FindOperator<E[keyof E]> {
    const convertedValue = convertValue(filter.value, propertyType);

    switch (filter.rule) {
        case FilterRule.IS_NULL:
            return IsNull();
        case FilterRule.IS_NOT_NULL:
            return Not(IsNull());
        case FilterRule.EQUALS:
            return Equal(convertedValue);
        case FilterRule.NOT_EQUALS:
            return Not(Equal(convertedValue));
        case FilterRule.GREATER_THAN:
            return MoreThan(convertedValue);
        case FilterRule.GREATER_THAN_OR_EQUALS:
            return MoreThanOrEqual(convertedValue);
        case FilterRule.LESS_THAN:
            return LessThan(convertedValue);
        case FilterRule.LESS_THAN_OR_EQUALS:
            return LessThanOrEqual(convertedValue);
        case FilterRule.LIKE:
            return ILike(`%${convertedValue}%`) as FindOperator<E[keyof E]>;
        case FilterRule.NOT_LIKE:
            return Not(ILike(`%${convertedValue}%`)) as FindOperator<E[keyof E]>;
        case FilterRule.IN:
            return In(convertArray(filter.value, propertyType));
        case FilterRule.NOT_IN:
            return Not(In(convertArray(filter.value, propertyType)));
        default:
            throw new Error(`Unsupported filter rule: ${filter.rule}`);
    }
}

/**
 * Sets a nested property value within an object given a list of keys.
 * If the value is an array (multiple conditions), it wraps them in an OR array.
 *
 * @template T - The object type.
 * @template V - The value type to set at the nested property.
 * @param {T} obj - The target object.
 * @param {string[]} keys - The list of nested keys.
 * @param {V | V[]} value - The value or array of values to set.
 */
function setNestedProperty<E extends BaseEntity>(obj: FindOptionsWhere<E>, keys: string[], value: any): void {
    let current: any = obj;
    for (let i = 0; i < keys.length - 1; i++) {
        if (!(keys[i] in current)) {
            current[keys[i]] = {};
        }
        current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
}

/**
 * Converts a value to the appropriate type based on the property type, supporting enums.
 *
 * @param {string | undefined} value - The value to convert.
 * @param {string | Function} type - The type to which the value should be converted.
 * @returns {any} - The converted value.
 */
function convertValue(value: string | undefined, type: string | Function): any {
    if (value === undefined) return '';

    if (typeof type === 'function' && Object.values(type).includes(value)) {
        return value;
    }

    if (type === 'number') {
        const number_ = Number(value);
        if (isNaN(number_)) {
            console.warn(`Invalid number: ${value}`);
            return value;
        }
        return number_;
    }

    if (type === 'Date' || type === 'datetime' || type === 'timestamp') {
        const date_ = new Date(value);
        if (isNaN(date_.getTime())) {
            console.warn(`Invalid date: ${value}`);
            return value;
        }
        return date_;
    }

    return value || '';
}

/**
 * Converts a comma-separated string to an array of values, converting each element to the appropriate type,
 * supporting enums.
 *
 * @param {string | undefined} value - The comma-separated string value to convert.
 * @param {string | Function} type - The type to which each element should be converted.
 * @returns {any[]} - An array of converted values.
 */
function convertArray(value: string | undefined, type: string | Function): any[] {
    if (!value) return [];

    return value.split(',').map((v) => convertValue(v.trim(), type));
}
