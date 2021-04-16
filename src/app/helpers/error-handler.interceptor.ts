import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, delay, retry } from "rxjs/operators";

@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request)
      .pipe(
        retry(2),
        delay(1000),
        catchError((err: HttpErrorResponse) => {
          let errMessage = '';

          if (err.error instanceof  ErrorEvent) {
            errMessage = `Error: ${err.error.message}`;
          } else {
            errMessage = `Error Code: ${err.status}\nMessage: ${err.message}`;
          }
          return throwError(errMessage);
        })
      );
  }
}
