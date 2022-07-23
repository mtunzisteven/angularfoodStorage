import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserEditComponent } from './user/user-edit/user-edit.component';
import { UserDetailComponent } from './user/user-detail/user-detail.component';
import { UserComponent } from './user/user.component';
import { SignInComponent } from './user/sign-in/sign-in.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductListComponent } from './products/product-list/product-list.component';
import { ProductEditComponent } from './products/product-edit/product-edit.component';

// creating routes for the entire application
const appRoutes: Routes = [
  {path:'', redirectTo: '/dashboard', pathMatch: 'full'},
  {path:'dashboard', component: DashboardComponent, children: [
    {path:'user', component: UserComponent},
    {path:'user/new', component: UserEditComponent}, // must be above :id route because Angular will confuse new for :id otherwise
    {path:'user/signin', component: SignInComponent},
    {path:'user:id', component: UserDetailComponent},
    {path:'user/:id/edit', component: UserEditComponent},
    {path:'products', component: ProductListComponent},
    {path:'product/new', component: ProductEditComponent}, // must be above :id route because Angular will confuse new for :id otherwise
    {path:'product/:id/edit', component: ProductEditComponent}
  ]} 
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
