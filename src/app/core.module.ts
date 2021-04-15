import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AuthInterceptor } from './auth/auth.interceptor';
import { ShoppingListService } from './shopping-list/shopping-list.service';

@NgModule({
  providers: [
    ShoppingListService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ]
})
export class CoreModule {}
