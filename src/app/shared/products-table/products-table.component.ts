import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { Product } from 'src/app/products/product.model';
import { ProductService } from 'src/app/products/product.service';
import { setExpiryNumbers } from '../setExpiryNumbers';

@Component({
  selector: 'app-products-table',
  templateUrl: './products-table.component.html'
})
export class ProductsTableComponent implements OnInit, OnDestroy {

  products: Product[];
  daysLeft = [];

  // specific to eacg product list group
  @Input() productListNumber = null

  servingsLeft: number;
  isLoading = true;
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
        this.products = this.productService.showProductsByExpirationStatus(products, this.productListNumber);

        // set expiry numbers to use for expiry information display
        let expiryNumbers = setExpiryNumbers(this.products, this.user);

        this.servingsLeft = expiryNumbers['servingsLeft'];

        // 
        this.products.forEach(product => {

            // time between expiry date and today
            let difference = Date.parse(product.expiryDate.toString())-Date.now();

            difference = Math.ceil(difference/ (1000 * 3600 * 24));

            // convert date to days
            this.daysLeft.push(difference);

        });

        this.isLoading = false;

        console.log(this.daysLeft);

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
