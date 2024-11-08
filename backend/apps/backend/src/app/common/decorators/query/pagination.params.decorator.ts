import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';

import { Request } from 'express';

const MAX_PAGE_SIZE = 500;
const DEFAULT_PAGE_SIZE = 10;

export { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE };

/**
 * Represents pagination parameters for a query.
 */
export interface Pagination {
    page: number;
    limit: number;
    size: number;
    offset: number;
}

/**
 * A decorator that extracts pagination parameters from the query string of a request.
 * It validates and constructs pagination criteria based on query parameters `page` and `size`.
 *
 * @param {unknown} _data - Unused parameter placeholder, necessary for the decorator signature.
 * @param {ExecutionContext} context - The execution context provided by NestJS.
 * @returns {Pagination} - An object containing pagination parameters (page, limit, size, offset).
 *
 * @throws {BadRequestException} If the pagination parameters (`page` or `size`) are invalid.
 *
 * @example
 * // URL: /api/items?page=2&size=20
 * PaginationParams(null, context)
 * // Returns: { page: 2, limit: 20, size: 20, offset: 40 }
 */
export const PaginationParams = createParamDecorator(
    (_data: unknown, context: ExecutionContext): Pagination => {
        const request: Request = context.switchToHttp().getRequest();

        // Parse `page` from query parameters with default fallback and type checks
        const page = request.query.page
            ? Array.isArray(request.query.page)
                ? Number.isNaN(Number.parseInt(request.query.page[0] as string, 10))
                    ? 0
                    : Number.parseInt(request.query.page[0] as string, 10)
                : Number.isNaN(Number.parseInt(request.query.page as string, 10))
                ? 0
                : Number.parseInt(request.query.page as string, 10)
            : 0;

        // Parse `size` from query parameters with default fallback and type checks
        const size =
            request.query.size &&
            !Array.isArray(request.query.size) &&
            !Number.isNaN(Number.parseInt(request.query.size as string, 10)) &&
            Number.parseInt(request.query.size as string, 10) > 0
                ? Number.parseInt(request.query.size as string, 10)
                : Array.isArray(request.query.size) &&
                  !Number.isNaN(Number.parseInt(request.query.size[0] as string, 10)) &&
                  Number.parseInt(request.query.size[0] as string, 10) > 0
                ? Number.parseInt(request.query.size[0] as string, 10)
                : DEFAULT_PAGE_SIZE;

        // Validate `page` and `size`
        if (Number.isNaN(page) || page < 0) {
            throw new BadRequestException('Invalid pagination params: Page must be a non-negative number');
        }
        if (Number.isNaN(size) || size <= 0) {
            throw new BadRequestException(`Invalid pagination params: Size must be a positive number`);
        }
        if (size > MAX_PAGE_SIZE) {
            throw new BadRequestException(`Invalid pagination params: Max size is ${MAX_PAGE_SIZE}`);
        }

        // Calculate pagination parameters
        const limit = size;
        const offset = page * limit;

        return { page, limit, size, offset };
    },
);
