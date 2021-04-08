import { Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { Recipe } from './recipe.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';

@Injectable()
export class RecipeService {
  private recipes: Recipe[] = [
    new Recipe(
      'cote-de-boeuf',
      'Côte de Boeuf',
      'Une magnifique côté de boeuf',
      'https://img.cuisineaz.com/660x660/2013-12-20/i2126-cote-de-boeuf-au-thym-et-au-romarin.jpeg',
      [
        new Ingredient('Meat', 1),
        new Ingredient('French Fries', 20)
      ]
    ),
    new Recipe(
      'burger',
      'Burger',
      'A wonderful burger',
      'https://cdn.pixabay.com/photo/2020/11/08/01/44/burger-5722678_960_720.jpg',
      [
        new Ingredient('Buns', 2),
        new Ingredient('Meat', 2)
      ]
    ),
  ];

  constructor(private shoppingListService: ShoppingListService) {}

  getRecipes(): Recipe[] {
    return this.recipes.slice();
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]): void {
    this.shoppingListService.addIngredients(ingredients);
  }

  getRecipe(index: number): Recipe {
    return this.recipes[index];
  }
}
