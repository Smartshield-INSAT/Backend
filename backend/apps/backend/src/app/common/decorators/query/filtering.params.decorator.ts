import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';

import { NestedKeys } from '../../utils/nested.keys.extractor';

import { Request } from 'express';

/**
 * Represents a filtering criteria used in query parameters.
 *
 * @template E - The entity type to which the filtering applies.
 */
export interface Filtering<E> {
    property: NestedKeys<E>;
    rule: FilterRule;
    value?: string;
}

/**
 * Enum representing valid filter rules for filtering query parameters.
 */
export enum FilterRule {
    EQUALS = 'eq',
    NOT_EQUALS = 'neq',
    GREATER_THAN = 'gt',
    GREATER_THAN_OR_EQUALS = 'gte',
    LESS_THAN = 'lt',
    LESS_THAN_OR_EQUALS = 'lte',
    LIKE = 'like',
    NOT_LIKE = 'nlike',
    IN = 'in',
    NOT_IN = 'nin',
    IS_NULL = 'isnull',
    IS_NOT_NULL = 'isnotnull',
}

/**
 * A decorator that extracts filtering parameters from the query string of a request.
 * It validates and constructs filtering criteria based on specified valid parameters.
 *
 * @template E - The entity type to which the filtering applies.
 * @param {ReadonlyArray<NestedKeys<E>>} validParameters - An array of valid properties that can be filtered on.
 * @returns {ParameterDecorator} A parameter decorator that can be used in a controller method.
 *
 * @throws {BadRequestException} If the filter parameters are invalid or if the provided parameters do not match the allowed properties.
 *
 * @example
 * class UserController {
 *   findAll(@FilteringParams<User>(['name', 'email', 'profile.age']) filters: Filtering<User>[] | null) {
 *     // Implementation
 *   }
 * }
 */
export function FilteringParams<E>(validParameters: ReadonlyArray<NestedKeys<E>>): ParameterDecorator {
    return (target: object, propertyKey: string | symbol | undefined, parameterIndex: number) => {
        const decorator = createParamDecorator(
            (_data: unknown, context: ExecutionContext): Filtering<E>[] | null => {
                const request: Request = context.switchToHttp().getRequest();

                const filters = request.query.filter
                    ? Array.isArray(request.query.filter)
                        ? request.query.filter.map(String)
                        : [String(request.query.filter)]
                    : null;

                if (!filters || filters.length === 0) return null;

                const filterings: Filtering<E>[] = [];

                for (const filter of filters) {
                    const match = filter.match(
                        /^([\w.]+):(eq|neq|gt|gte|lt|lte|like|nlike|in|nin):([\w,.:-]*)$|^([\w.]+):(isnull|isnotnull)$/,
                    );
                    if (!match) {
                        throw new BadRequestException('Invalid filter parameter format');
                    }

                    const [, propertyString, ruleString, value, propertyWithoutValue, ruleWithoutValue] =
                        match;

                    const property = (propertyString || propertyWithoutValue) as NestedKeys<E>;
                    const rule = (ruleString || ruleWithoutValue) as FilterRule;

                    if (!validParameters.includes(property)) {
                        throw new BadRequestException(`Invalid filter property: ${String(property)}`);
                    }

                    if (!Object.values(FilterRule).includes(rule)) {
                        throw new BadRequestException(`Invalid filter rule: ${rule}`);
                    }

                    filterings.push({ property, rule, value });
                }

                return filterings.length > 0 ? filterings : null;
            },
        );

        return decorator(validParameters)(target, propertyKey, parameterIndex);
    };
}
