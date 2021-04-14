import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService, AuthResponseData } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
})
export class AuthComponent {
  isLoginMode = true;
  isPending = false;
  signUpError = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSwitchLoginMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    this.signUpError = '';
    if (!form.valid) {
      return;
    }

    this.isPending = true;
    const email = form.value.email;
    const password = form.value.password;
    let authObs: Observable<AuthResponseData>;

    if (this.isLoginMode) {
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.signupMethod(email, password);
    }

    authObs.subscribe(
      (responseData) => {
        console.log(responseData);
        this.isPending = false;
        this.router.navigate(['/recipes']);
      },
      (error: string) => {
        console.log(error);
        this.isPending = false;
        this.signUpError = error;
      }
    );

    form.reset();
  }
}
