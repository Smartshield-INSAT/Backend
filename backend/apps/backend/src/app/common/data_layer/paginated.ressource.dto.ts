export class PaginatedResource<T> {
    totalItems!: number;
    page!: number;
    size!: number;
    items!: T[];
}
