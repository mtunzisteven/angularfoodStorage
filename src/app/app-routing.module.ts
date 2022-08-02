import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserEditComponent } from './user/user-edit/user-edit.component';
import { UserDetailComponent } from './user/user-detail/user-detail.component';
import { UserComponent } from './user/user.component';
import { SignInComponent } from './user/sign-in/sign-in.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductListComponent } from './products/product-list/product-list.component';
import { ProductEditComponent } from './products/product-edit/product-edit.component';
import { ProductsComponent } from './products/products.component';
import { ExpiredProductsComponent } from './products/expired-products/expired-products.component';
import { RemovedProductsComponent } from './products/removed-products/removed-products.component';
import { ExpiredGroupAComponent } from './products/expired-group-a/expired-group-a.component';
import { ExpiredGroupBComponent } from './products/expired-group-b/expired-group-b.component';
import { ExpiredGroupCComponent } from './products/expired-group-c/expired-group-c.component';

// creating routes for the entire application
const appRoutes: Routes = [
  {path:'', redirectTo: '/dashboard', pathMatch: 'full'}, 
  {path:'dashboard', component: DashboardComponent},
  {path:'products', component: ProductsComponent, children: [
    {path:'list', component: ProductListComponent},
    {path:'expires-in-1-month', component: ExpiredGroupAComponent},
    {path:'expires-in-3-months', component: ExpiredGroupBComponent},
    {path:'expires-in-1-year', component: ExpiredGroupCComponent},
    {path:'expired', component: ExpiredProductsComponent},
    {path:'removed', component: RemovedProductsComponent},
    {path:'new', component: ProductEditComponent}, // must be above :id route because Angular will confuse new for :id otherwise
    {path:':id/edit', component: ProductEditComponent}
  ]},
  {path:'user', component: UserComponent, children: [
    {path:'new', component: UserEditComponent}, 
    {path:'login', component: SignInComponent},
    {path:'user', component: UserComponent},
    {path:'user/:id/edit', component: UserEditComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
