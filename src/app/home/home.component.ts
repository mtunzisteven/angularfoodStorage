import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth.service';
import { Product } from '../products/product.model';
import { ProductService } from '../products/product.service';
import { User } from '../user/user.model';
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

  subscription: Subscription;
  subscription2: Subscription;

  expiryNumbers: {};

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private productService: ProductService,
    private router: Router
    ) { }

  ngOnInit(): void {
   
    this.user = this.authService.user;

    this.subscription2 = this.authService.userChangedEvent.subscribe(
      (user) =>{
        this.user = user;

      }
    );

    this.products = this.productService.getProducts();

    this.subscription = this.productService.productListChangedEvent
      .subscribe(
        (products: Product[]) =>{

          this.products = products;

          this.expiryNumbers = setExpiryNumbers(this.products, this.user);

        }
      );

    this.expiryNumbers = setExpiryNumbers(this.products, this.user);

  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
    this.subscription2.unsubscribe();

  }

  // setExpiryNumbers(products: Product[]){

  //   // remove expired products
  //   let activeProducts = products.filter(product => {

  //     let difference = Date.parse(product.expiryDate.toString())-Date.now();

  //     return (Math.ceil(difference/ (1000 * 3600 * 24))) > 0;

  //   });


  //   // filter for items expiring in 1 month: 30 days or less
  //   let  expireInMonth = activeProducts.filter(product =>{

  //     let difference = Date.parse(product.expiryDate.toString())-Date.parse(product.addedDate.toString());

  //     return (Math.ceil(difference/ (1000 * 3600 * 24))) < 31;

  //   })

  //   // filter for items expiring in 3 month: 92 days or less
  //   let  expireInThreeMonths = activeProducts.filter(product =>{
  //     let difference = Date.parse(product.expiryDate.toString())-Date.parse(product.addedDate.toString());

  //     return (Math.ceil(difference/ (1000 * 3600 * 24))) < 93;
  //   })

  //   // filter for items expiring in 1 year: 365 days or less
  //   let  expireInYear = activeProducts.filter(product =>{
  //     let difference = Date.parse(product.expiryDate.toString())-Date.parse(product.addedDate.toString());

  //     return (Math.ceil(difference/ (1000 * 3600 * 24))) < 365;
  //   })

  //   // initialize servingsLeft
  //   this.servingsLeft = 0;

  //   // get the total number of servings   
  //   activeProducts.forEach(product => {

  //     this.servingsLeft += product.servings;

  //   });

  //   // only access user data if we are logged in
  //   if(this.user){

  //     // divide the numbe rof servings remaining by 3 meals a day
  //     // user is nested in user obj
  //     this.servingsLeft = Math.round((this.servingsLeft/3)/this.user['user'].familySize);

  //   }



  //   // set the number of items expiring in 1 month, 3 months, and 1 year
  //   this.month =expireInMonth.length;
  //   this.threeMonths =expireInThreeMonths.length;
  //   this.year =expireInYear.length;

  // }

}
