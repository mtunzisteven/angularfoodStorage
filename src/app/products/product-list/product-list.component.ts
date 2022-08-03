import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/auth.service';
import { setExpiryNumbers } from 'src/app/shared/setExpiryNumbers';
import { Product } from '../product.model';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {

  subscription: Subscription;

  products: Product[];

  servingsLeft: number;

  constructor(
    private productService: ProductService,
    private authService: AuthService
    ) { }

  ngOnInit(): void {

    // get user from user object
    let user = this.authService.user;

    console.log(user);

    // get products and remove those that have expired using 
    this.products = this.productService.showProductsByExpirationStatus(this.productService.products, 100);

    this.subscription = this.productService.productListChangedEvent
      .subscribe(
        (products: Product[]) =>{

          // remove expired products
          this.products = this.productService.showProductsByExpirationStatus(products, 100);

          let expiryNumbers = setExpiryNumbers(this.products, user);

          this.servingsLeft = expiryNumbers['servingsLeft'];

          console.log('==================Expiry Numbers====================');
          console.log(expiryNumbers);
          
        }
      );

      let expiryNumbers = setExpiryNumbers(this.products, user);

      this.servingsLeft = expiryNumbers['servingsLeft'];

      console.log('==================Expiry Numbers====================');
      console.log(expiryNumbers);

  }

  ngOnDestroy(): void{

    this.subscription.unsubscribe();

  }

}
