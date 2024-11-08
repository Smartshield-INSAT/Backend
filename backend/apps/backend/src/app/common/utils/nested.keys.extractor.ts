/**
 * Represents primitive types in TypeScript.
 */
type Primitive = string | number | boolean | bigint | symbol | null | undefined;

/**
 * Utility type to check if a type is a function
 */
type IsFunction<T> = T extends (...arguments_: unknown[]) => unknown ? true : false;

/**
 * Constructs a type representing nested keys of an object type, supporting dot notation for nested properties.
 * Correctly excludes methods and functions from the resulting keys at all nested levels.
 *
 * @template T - The type to extract nested keys from.
 */
export type NestedKeys<T> = T extends Primitive
    ? never
    : T extends unknown[]
    ? `${number}`
    : {
          [K in Extract<keyof T, string>]: IsFunction<T[K]> extends true
              ? never
              : T[K] extends object
              ? K | `${K}.${NestedKeys<T[K]>}`
              : K;
      }[Extract<keyof T, string>];

/**
 * Represents a nested structure of relations where each key is a relation name
 * and the value is either true (to include the relation) or another nested structure.
 */
export type NestedRelations<T> = {
    [K in NestedKeys<T>]?: boolean | NestedRelations<T[K extends keyof T ? K : never]>;
};
