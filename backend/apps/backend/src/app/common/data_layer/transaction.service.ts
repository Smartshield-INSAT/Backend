import { Injectable } from '@nestjs/common';

import { catchError, defer, from, map, Observable, switchMap, throwError, timeout, TimeoutError } from 'rxjs';
import { EntityManager, QueryRunner } from 'typeorm';

@Injectable()
export class TransactionService {
    constructor(private manager: EntityManager) {}

    /**
     * Starts a transaction using a QueryRunner.
     *
     * @returns {Observable<QueryRunner>} An observable that emits the started QueryRunner.
     */
    startTransactionByQueryRunner(): Observable<QueryRunner> {
        const queryRunner: QueryRunner = this.manager.connection.createQueryRunner();

        return defer(() =>
            from(queryRunner.connect()).pipe(
                switchMap(() => from(queryRunner.startTransaction())),
                map(() => queryRunner),
                timeout(30_000), // 30 seconds timeout
                catchError((error) => {
                    if (error instanceof TimeoutError) {
                        // Handle timeout error by releasing the query runner and throwing an error
                        return from(queryRunner.release()).pipe(
                            switchMap(() => throwError(() => new Error('Transaction timeout'))),
                        );
                    }
                    // Propagate other errors and ensure the query runner is released
                    return from(queryRunner.release()).pipe(switchMap(() => throwError(() => error)));
                }),
            ),
        );
    }

    /**
     * Commits the transaction for the provided QueryRunner.
     *
     * @param {QueryRunner} queryRunner - The QueryRunner to commit.
     * @returns {Observable<boolean>} An observable that emits `true` when the transaction is committed.
     */
    commitTransactionByQueryRunner(queryRunner: QueryRunner): Observable<boolean> {
        return from(queryRunner.commitTransaction()).pipe(
            map(() => true),
            catchError((error) => {
                // Ensure proper release of the QueryRunner on error
                return from(queryRunner.release()).pipe(
                    switchMap(() =>
                        throwError(() => new Error(`Failed to commit transaction: ${error.message}`)),
                    ),
                );
            }),
        );
    }

    /**
     * Rolls back the transaction for the provided QueryRunner.
     *
     * @param {QueryRunner} queryRunner - The QueryRunner to roll back.
     * @returns {Observable<boolean>} An observable that emits `true` when the transaction is rolled back.
     */
    rollbackTransactionByQueryRunner(queryRunner: QueryRunner): Observable<boolean> {
        return from(queryRunner.rollbackTransaction()).pipe(
            map(() => true),
            catchError((error) => {
                // Ensure proper release of the QueryRunner on error
                return from(queryRunner.release()).pipe(
                    switchMap(() =>
                        throwError(() => new Error(`Failed to rollback transaction: ${error.message}`)),
                    ),
                );
            }),
        );
    }

    /**
     * Releases the provided QueryRunner.
     *
     * @param {QueryRunner} queryRunner - The QueryRunner to release.
     * @returns {Observable<boolean>} An observable that emits `true` when the QueryRunner is released.
     */
    releaseByQueryRunner(queryRunner: QueryRunner): Observable<boolean> {
        return from(queryRunner.release()).pipe(
            map(() => true),
            catchError((error) => {
                return throwError(() => new Error(`Failed to release QueryRunner: ${error.message}`));
            }),
        );
    }
}
