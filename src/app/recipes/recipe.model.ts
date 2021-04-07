import { Ingredient } from '../shared/ingredient.model';
export class Recipe {
  public slug: string;
  public name: string;
  public description: string;
  public imagePath: string;
  public ingredients: Ingredient[];

  constructor(slug: string, name: string, description: string, imagePath: string, ingredients: Ingredient[]) {
    this.slug = slug;
    this.name = name;
    this.description = description;
    this.imagePath = imagePath;
    this.ingredients = ingredients;
  }
}
