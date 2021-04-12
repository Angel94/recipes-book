import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { RecipeService } from './recipes/recipe.service';

@Injectable({
  providedIn: 'root',
})
export class RecipeGuard implements CanActivate {
  constructor(private recipeService: RecipeService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const recipe = this.recipeService.getRecipe(+route.params.id);
    if (!recipe) {
      this.router.navigate(['recipes']);
      return false;
    }

    return true;
  }
}
