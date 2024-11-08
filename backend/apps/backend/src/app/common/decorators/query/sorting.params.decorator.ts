import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';


import { Request } from 'express';
import { NestedKeys } from '../../utils/nested.keys.extractor';

/**
 * Represents sorting criteria for query parameters.
 *
 * @template E - The entity type to which the sorting applies.
 */
export interface Sorting<E> {
    property: NestedKeys<E>;
    direction: 'asc' | 'desc' | 'ASC' | 'DESC';
}

/**
 * A decorator that extracts sorting parameters from the query string of a request.
 * It validates and constructs sorting criteria based on specified valid parameters.
 *
 * @template E - The entity type to which the sorting applies.
 * @param {ReadonlyArray<NestedKeys<E>>} validParameters - An array of valid properties that can be sorted on.
 * @returns {ParameterDecorator} A parameter decorator that can be used in a controller method.
 *
 * @throws {BadRequestException} If the sort parameters are invalid or if the provided parameters do not match the allowed properties.
 *
 * @example
 * class UserController {
 *   findAll(@SortingParams<User>(['name', 'email', 'profile.age']) sort: Sorting<User> | null) {
 *     // Implementation
 *   }
 * }
 */
export function SortingParams<E>(validParameters: ReadonlyArray<NestedKeys<E>>): ParameterDecorator {
    return (target: object, propertyKey: string | symbol | undefined, parameterIndex: number) => {
        const decorator = createParamDecorator(
            (_data: unknown, context: ExecutionContext): Sorting<E> | null => {
                const request: Request = context.switchToHttp().getRequest();

                const sortParameter = request.query.sort;
                const sort = sortParameter
                    ? Array.isArray(sortParameter)
                        ? String(sortParameter[0])
                        : String(sortParameter)
                    : null;

                if (!sort) return null;

                const sortPattern = /^([\w.]+):(asc|desc|ASC|DESC)$/;
                if (!sortPattern.test(sort)) {
                    throw new BadRequestException(
                        'Invalid sort parameter format: Expected format is `property:direction`',
                    );
                }

                const [propertyString, direction] = sort.split(':') as [
                    NestedKeys<E>,
                    Sorting<E>['direction'],
                ];

                if (!validParameters.includes(propertyString)) {
                    throw new BadRequestException(`Invalid sort property: ${String(propertyString)}`);
                }

                const validDirections: Sorting<E>['direction'][] = ['asc', 'desc', 'ASC', 'DESC'];
                if (!validDirections.includes(direction)) {
                    throw new BadRequestException(`Invalid sort direction: ${direction}`);
                }

                return { property: propertyString, direction };
            },
        );

        return decorator(validParameters)(target, propertyKey, parameterIndex);
    };
}
