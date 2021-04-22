import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, Effect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import * as AuthActions from './auth.actions';
import { environment } from '../../../environments/environment';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { Action } from '@ngrx/store';
import { User } from '../user.model';
import { AuthService } from '../auth.service';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

const handleAuthentication = (
  email: string,
  userId: string,
  token: string,
  expiresIn: number
) => {
  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
  const user = new User(email, userId, token, expirationDate);
  localStorage.setItem('user', JSON.stringify(user));
  return new AuthActions.Login({ email, userId, token, expirationDate });
};

const handleError = (errorResponse) => {
  let errorMessage = 'An error occurred!';

  if (!errorResponse.error || !errorResponse.error.error) {
    return of(new AuthActions.LoginFail(errorMessage));
  }

  switch (errorResponse.error.error.message) {
    case 'EMAIL_EXISTS':
      errorMessage = 'This email already exists!';
      break;
    case 'INVALID_EMAIL':
      errorMessage = 'This email is invalid!';
      break;
    case 'EMAIL_NOT_FOUND':
      errorMessage = 'This email does not exists!';
      break;
    case 'INVALID_PASSWORD':
      errorMessage = 'The password is invalid!';
      break;
  }

  return of(new AuthActions.LoginFail(errorMessage));
};

@Injectable()
export class AuthEffects {
  authSignup$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.SIGNUP_START),
      switchMap((signupStart: AuthActions.SignupStart) => {
        return this.http
          .post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' +
              environment.firebaseAPIKey,
            {
              email: signupStart.payload.email,
              password: signupStart.payload.password,
              returnSecureToken: true,
            }
          )
          .pipe(
            tap((r) => {
              this.authService.setLogoutTimer(+r.expiresIn * 1000);
            }),
            map((r) => {
              return handleAuthentication(
                r.email,
                r.localId,
                r.idToken,
                +r.expiresIn
              );
            }),
            catchError((errorResponse) => handleError(errorResponse))
          );
      })
    );
  });

  authLogin$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.LOGIN_START),
      switchMap((authStart: AuthActions.LoginStart) => {
        return this.http
          .post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' +
              environment.firebaseAPIKey,
            {
              email: authStart.payload.email,
              password: authStart.payload.password,
              returnSecureToken: true,
            }
          )
          .pipe(
            tap((r) => {
              this.authService.setLogoutTimer(+r.expiresIn * 1000);
            }),
            map((r) => {
              return handleAuthentication(
                r.email,
                r.localId,
                r.idToken,
                +r.expiresIn
              );
            }),
            catchError((errorResponse) => handleError(errorResponse))
          );
      })
    );
  });

  authAutoLogin$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.AUTO_LOGIN),
      map(() => {
        const userData: {
          email: string;
          id: string;
          _token: string;
          _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('user'));

        if (!userData) {
          return { type: '[Auth] Invalid user' };
        }

        const loadedUser = new User(
          userData.email,
          userData.id,
          userData._token,
          new Date(userData._tokenExpirationDate)
        );

        if (!loadedUser.token) {
          localStorage.removeItem('user');
          return { type: '[Auth] Invalid user' };
        }

        const expiresIn = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
        this.authService.setLogoutTimer(expiresIn);

        return new AuthActions.Login({
          email: userData.email,
          userId: userData.id,
          token: userData._token,
          expirationDate: new Date(userData._tokenExpirationDate),
        });
      })
    );
  });

  authRedirect$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.LOGIN),
        tap(() => {
          this.router.navigate(['/']);
        })
      );
    },
    {
      dispatch: false,
    }
  );

  authLogout$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.LOGOUT),
        tap(() => {
          this.authService.clearLogoutTimer();
          localStorage.removeItem('user');
          this.router.navigate(['/auth']);
        })
      );
    },
    {
      dispatch: false,
    }
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}
}
