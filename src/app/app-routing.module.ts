import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecipesComponent } from './recipes/recipes.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component';
import { RecipeStartComponent } from './recipes/recipe-start/recipe-start.component';
import { RecipeEditComponent } from './recipes/recipe-edit/recipe-edit.component';
import { RecipesResolverService } from './recipes/recipes-resolver.service';
import { RecipeGuard } from './recipes/recipe.guard';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth.guard';

const appRoutes: Routes = [
  { path: '', redirectTo: '/recipes', pathMatch: 'full' },
  // { path: 'recipes', component: RecipesComponent, resolve: [RecipesResolverService], children: [
  { path: 'recipes', component: RecipesComponent, canActivate: [AuthGuard], children: [
    { path: '', component: RecipeStartComponent },
    { path: 'new', component: RecipeEditComponent },
    { path: ':id', component: RecipeDetailComponent, canActivate: [RecipeGuard] },
    { path: ':id/edit', component: RecipeEditComponent, canActivate: [RecipeGuard] },
  ] },
  { path: 'shopping-list', component: ShoppingListComponent },
  { path: 'auth', component: AuthComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModudle {}
