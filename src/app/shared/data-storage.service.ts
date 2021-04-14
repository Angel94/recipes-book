import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { exhaustMap, map, take, tap } from 'rxjs/operators';

import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  private apiHost =
    'https://ng-complete-course-a2a45-default-rtdb.europe-west1.firebasedatabase.app/';
  private recipesApi = this.apiHost + 'recipes.json';

  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private authService: AuthService
  ) {}

  storeRecipe(): void {
    const recipes = this.recipeService.getRecipes();
    this.http.put(this.recipesApi, recipes).subscribe((reponseData) => {
      console.log(reponseData);
    });
  }

  fetchRecipes(): Observable<Recipe[]> {
    // Auth token is added by AuthInterceptor
    return this.http
      .get<Recipe[]>(this.recipesApi)
      .pipe(
        map((recipes: Recipe[]): Recipe[] => {
          return recipes.map((item) => {
            return {
              ...item,
              ingredients: item.ingredients ? item.ingredients : [],
            };
          });
        }),
        tap((recipes: Recipe[]): void => {
          this.recipeService.setRecipes(recipes);
        })
      );
  }
}
