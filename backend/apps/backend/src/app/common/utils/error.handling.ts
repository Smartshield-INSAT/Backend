import { HttpException, InternalServerErrorException } from '@nestjs/common';

import { catchError, OperatorFunction, throwError } from 'rxjs';

const handleError = <T>(): OperatorFunction<T, T> => catchError(toError);
const toError = (error: unknown) => {
    if (error instanceof HttpException) {
        return throwError(() => error);
    } else {
        console.log(`[ERROR]:${error}`);
        return throwError(() => new InternalServerErrorException(`An unexpected error occurred: ${error}`));
    }
};
export { handleError, toError as toErr };
