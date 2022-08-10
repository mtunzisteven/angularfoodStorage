import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { Product } from '../products/product.model';
import { ProductService } from '../products/product.service';
import { User } from '../auth/user.model';
import { UserService } from '../user/user.service';
import { setExpiryNumbers } from '../shared/setExpiryNumbers';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  user: User;
  products: Product[];
  isAuthenticated = false;
  isLoading = false;
  
  productsSubscription: Subscription;

  expiryNumbers: {};
  servingsLeft: number;
  monthToExpire: number;
  threeMonthsToExpire: number;
  yearToExpire: number;


  constructor(
    private userService: UserService,
    private authService: AuthService,
    private productService: ProductService,
    private router: Router
    ) { }

  ngOnInit(): void {
   
    // this user observable is special and will stop after the value is retrieved
    this.authService.user
    .subscribe(
      (user) =>{

        this.user = user; 
        this.isAuthenticated = !!this.user;
      }
    );

    this.productsSubscription = this.productService.fetchProducts()
    .subscribe(
      // success method
      (products: Product[]) => {

        // remove expired products
        this.products = this.productService.showProductsByExpirationStatus(products, null);

        // set expiry numbers to use for expiry information display
        this.expiryNumbers = setExpiryNumbers(products, this.user);

        this.servingsLeft = this.expiryNumbers['servingsLeft'];
        this.monthToExpire = this.expiryNumbers['month'];
        this.threeMonthsToExpire = this.expiryNumbers['threeMonths'];
        this.yearToExpire = this.expiryNumbers['year'];

        console.log(this.expiryNumbers )

        this.isLoading = false;
      },
      // error method
      (error: any) => {
          console.log(error);
          this.isLoading = false;
      } 
    );

  }

  ngOnDestroy(){
    this.productsSubscription.unsubscribe();
  }
}
