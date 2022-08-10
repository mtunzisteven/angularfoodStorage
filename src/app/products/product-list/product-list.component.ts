import { Component, OnDestroy, OnInit } from '@angular/core';
import { exhaustMap, map, Subscription, take } from 'rxjs';

import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { setExpiryNumbers } from 'src/app/shared/setExpiryNumbers';
import { Product } from '../product.model';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {

  products: Product[];

  servingsLeft: number;

  productSub: Subscription;
  subscription: Subscription;

  user: User;

  constructor(
    private productService: ProductService,
    private authService: AuthService
    ) { }

  ngOnInit(): void {

   
    // this user observable is special and will stop after the value is retrieved
    this.authService.user
    .subscribe(
      (user) =>{

        this.user = user; 
      }
    );

    // fetch products from the products service
    this.subscription = this.productService.fetchProducts()
    .subscribe(
      // success method
      (products: Product[]) => {

        // remove expired products
        this.products = this.productService.showProductsByExpirationStatus(products, null);

        // set expiry numbers to use for expiry information display
        let expiryNumbers = setExpiryNumbers(this.products, this.user);

        this.servingsLeft = expiryNumbers['servingsLeft'];

      },
      // error method
      (error: any) => {
          console.log(error);
      } 
    );
    
    // subscribe to changes in the products list found in the products service
    this.productSub = this.productService.productListChangedEvent
      .subscribe(
        (products: Product[]) =>{

          // remove expired products
          this.products = this.productService.showProductsByExpirationStatus(products, null);

          let expiryNumbers = setExpiryNumbers(this.products, this.user);

          this.servingsLeft = expiryNumbers['servingsLeft'];
          
        }
    );

  }

  ngOnDestroy(): void{
    this.subscription.unsubscribe();
    this.productSub.unsubscribe();

  }

  onDeleteProduct(product: Product){

    this.productService.deleteProduct(product);
    
  }

}
