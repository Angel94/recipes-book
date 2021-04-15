import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { exhaustMap, take } from 'rxjs/operators';
import { User } from './user.model';
import { HttpParams } from '@angular/common/http';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return this.authService.user
      .pipe(
        take(1),
        exhaustMap((user: User) => {
          if (!user) {
            return next.handle(request);
          }

          const modifiedReq = request.clone({
            params: new HttpParams().set('auth', user.token)
          });
          return next.handle(modifiedReq);
        })
      );
  }
}