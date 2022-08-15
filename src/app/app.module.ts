import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { UserComponent } from './user/user.component';
import { UserEditComponent } from './user/user-edit/user-edit.component';
import { ProductsComponent } from './products/products.component';
import { ProductListComponent } from './products/product-list/product-list.component';
import { ProductEditComponent } from './products/product-edit/product-edit.component';
import { HeaderComponent } from './header/header.component';
import { DropdownDirective } from './shared/dropdown.directive';
import { UserDetailComponent } from './user/user-detail/user-detail.component';
import { LoggingInterceptorService } from './logging-interceptor.service';
import { ExpiredGroupAComponent } from './products/expired-group-a/expired-group-a.component';
import { ExpiredGroupBComponent } from './products/expired-group-b/expired-group-b.component';
import { ExpiredGroupCComponent } from './products/expired-group-c/expired-group-c.component';
import { RemovedProductsComponent } from './products/removed-products/removed-products.component';
import { ExpiredProductsComponent } from './products/expired-products/expired-products.component';
import { AuthComponent } from './auth/auth.component';
import { LoadingSpinnerComponent } from './shared/loading-spinners/loading-spinner.component';
import { ProductsTableComponent } from './shared/products-table/products-table.component';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { FilterPipe } from './filter.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UserComponent,
    UserEditComponent,
    ProductsComponent,
    ProductListComponent,
    ProductEditComponent,
    HeaderComponent,
    DropdownDirective,
    UserDetailComponent,
    ExpiredGroupAComponent,
    ExpiredGroupBComponent,
    ExpiredGroupCComponent,
    RemovedProductsComponent,
    ExpiredProductsComponent,
    AuthComponent,
    LoadingSpinnerComponent,
    ProductsTableComponent,
    FilterPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  exports:[
    DropdownDirective
  ],
  providers: [ 
    { // provide the AuthInterceptorService in a special way as follows | order important: auth first
      provide: HTTP_INTERCEPTORS, // token by which this injection can be identified by Angular to alert it this it is an http interceptor
      useClass:AuthInterceptorService, // The actual interceptor service we're injecting 
      multi: true // inform Angular not to replace other http interceptors with this one, but use them together
    },
    { // provide the LoggingInterceptorService in a special way as follows | order important: auth first
      provide: HTTP_INTERCEPTORS, // token by which this injection can be identified by Angular to alert it this it is an http interceptor
      useClass:LoggingInterceptorService, // The actual interceptor service we're injecting 
      multi: true // inform Angular not to replace other http interceptors with this one, but use them together
    }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
