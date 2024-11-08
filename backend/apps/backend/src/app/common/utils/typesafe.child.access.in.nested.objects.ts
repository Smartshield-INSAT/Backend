import { FindOptionsWhere } from 'typeorm';

/**
 * Sets the value of a specified field in an object while ensuring type safety.
 * This function is designed to handle dynamic field access in TypeScript where
 * the field name is determined at runtime, and the value assigned adheres to the type of the field.
 *
 * @template T - The type of the object that contains the field.
 * @template K - The key of the field in the object.
 * @param {T} obj - The object on which the field is being set.
 * @param {K} field - The field of the object that needs to be set.
 * @param {T[K] extends FindOptionsWhere<infer U> ? FindOptionsWhere<U> : T[K]} value - The value to set for the field.
 * If the field is a relation type (FindOptionsWhere), the value must match that type.
 * Otherwise, it should match the type of the field in the object.
 * @returns {void} - This function does not return a value.
 *
 * @example
 * // Example usage with a product entity and a relation field 'pr'
 * const productWhere: FindOptionsWhere<Product> = {};
 * setRelationField(productWhere, 'pr', { id: In([1, 2, 3]) });
 *
 * @example
 * // Example usage with a simple field 'status'
 * setRelationField(productWhere, 'status', StockStatusEnum.IN_STOCK);
 */
export function setRelationField<T, K extends keyof T>(
    object: T,
    field: K,
    value: T[K] extends FindOptionsWhere<infer U> ? FindOptionsWhere<U> : T[K],
): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    object[field] = value as any; // Type assertion to any if required, but keeps strong typing
}
