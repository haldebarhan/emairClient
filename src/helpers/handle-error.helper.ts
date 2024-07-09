import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

export const handleError = (error: HttpErrorResponse) => {
  let errorMessage = '';
  if (error.status === 404) {
    errorMessage = 'Resource not found';
  } else if (error.status === 500) {
    errorMessage = 'Internal server error';
  } else {
    errorMessage = `Unexpected error: ${error.status}`;
  }

  return throwError(() => new Error(errorMessage));
};
