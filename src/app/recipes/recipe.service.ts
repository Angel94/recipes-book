import { Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { Recipe } from './recipe.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class RecipeService {
  recipesChanges = new Subject<Recipe[]>();

  private recipes: Recipe[] = [
  ];

  constructor(private shoppingListService: ShoppingListService) {}

  getRecipes(): Recipe[] {
    return this.recipes.slice();
  }

  setRecipes(recipes: Recipe[]): void {
    this.recipes = recipes;
    this.recipesChanges.next(this.recipes.slice());
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]): void {
    this.shoppingListService.addIngredients(ingredients);
  }

  getRecipe(index: number): Recipe {
    return this.recipes[index];
  }

  addRecipe(recipe: Recipe): void {
    this.recipes.push(recipe);
    this.recipesChanges.next(this.recipes.slice());
  }

  updateRecipe(index: number, recipe: Recipe): void {
    this.recipes[index] = recipe;
    this.recipesChanges.next(this.recipes.slice());
  }

  deleteRecipe(index: number): void {
    this.recipes.splice(index, 1);
    this.recipesChanges.next(this.recipes.slice());
  }
}
