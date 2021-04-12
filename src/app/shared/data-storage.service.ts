import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';

import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  private apiHost =
    'https://ng-complete-course-a2a45-default-rtdb.europe-west1.firebasedatabase.app/';
  private recipesApi = this.apiHost + 'recipes.json';

  constructor(private http: HttpClient, private recipeService: RecipeService) {}

  storeRecipe(): void {
    const recipes = this.recipeService.getRecipes();
    this.http.put(this.recipesApi, recipes).subscribe((reponseData) => {
      console.log(reponseData);
    });
  }

  fetchRecipes(): Observable<Recipe[]> {
    return this.http
      .get<Recipe[]>(this.recipesApi)
      .pipe(
        map((recipes) => {
          return recipes.map((item) => {
            return {
              ...item,
              ingredients: item.ingredients ? item.ingredients : [],
            };
          });
        }),
        tap(recipes => {
          this.recipeService.setRecipes(recipes);
        })
      );
  }
}
