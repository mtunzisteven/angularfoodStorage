import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
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

  // specific to each product list group
  @Input() productListNumber = null

  servingsLeft: number;
  isLoading = true;
  productSub: Subscription;

  user: User;

  // the search term used in product list
  @Input() term = '';

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
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
    this.products = this.productService.getProducts()

    // remove expired products
    this.products = this.productService.showProductsByExpirationStatus(this.products, this.productListNumber);

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
    this.productSub.unsubscribe();

  }

  onDeleteProduct(product: Product){

    this.productService.deleteProduct(product);
    this.router.navigate(['../','list'], {relativeTo: this.route});

  }

}
