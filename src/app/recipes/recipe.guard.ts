import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import * as fromApp from '../store/app.reducer';
import * as RecipeActions from '../recipes/store/recipe.actions';
import { Actions, ofType } from '@ngrx/effects';

@Injectable({
  providedIn: 'root',
})
export class RecipeGuard implements CanActivate {
  constructor(private store: Store<fromApp.AppState>, private actions$: Actions) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
      this.store.dispatch(new RecipeActions.FetchRecipes());
      console.log('recipe-guard');

      return this.actions$.pipe(ofType(RecipeActions.SET_RECIPES)).pipe(map((setRecipesActions: RecipeActions.SetRecipes) => {
        const recipe = setRecipesActions.payload.find((value, index) => {
          return index === +route.params.id;
        });

        return !!recipe;
      }));
  }
}
