import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserComponent } from './user/user.component';
import { UserEditComponent } from './user/user-edit/user-edit.component';
import { ProductsComponent } from './products/products.component';
import { ProductListComponent } from './products/product-list/product-list.component';
import { ProductItemComponent } from './products/product-list/product-item/product-item.component';
import { ProductEditComponent } from './products/product-edit/product-edit.component';
import { HeaderComponent } from './header/header.component';
import { DropdownDirective } from './shared/dropdown.directive';
import { UserDetailComponent } from './user/user-detail/user-detail.component';
import { SignInComponent } from './user/sign-in/sign-in.component';
import { LoggingInterceptorService } from './logging-interceptor.service';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    UserComponent,
    UserEditComponent,
    ProductsComponent,
    ProductListComponent,
    ProductItemComponent,
    ProductEditComponent,
    HeaderComponent,
    DropdownDirective,
    UserDetailComponent,
    SignInComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [ 
    { // provide the LoggingInterceptorService in a special way as follows | order important: auth first
      provide: HTTP_INTERCEPTORS, // token by which this injection can be identified by Angular to alert it this it is an http interceptor
      useClass:LoggingInterceptorService, // The actual interceptor service we're injecting 
      multi: true // inform Angular not to replace other http interceptors with this one, but use them together
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
