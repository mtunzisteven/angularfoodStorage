import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { Product } from '../product.model';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-expired-group-c',
  templateUrl: './expired-group-c.component.html',
  styleUrls: ['./expired-group-c.component.css']
})
export class ExpiredGroupCComponent implements OnInit , OnDestroy {
  

  productSub: Subscription;
  user:User;

  products: Product[];

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

    // get products from the products service
    this.products = this.productService.getProducts();

    // remove expired products
    this.products = this.productService.showProductsByExpirationStatus(this.products, 365);

    // subscribe to changes in the products list found in the products service
    this.productSub = this.productService.productListChangedEvent
      .subscribe(
        (products: Product[]) =>{

          // remove expired products
          this.products = this.productService.showProductsByExpirationStatus(products, 365);
          
        },
        // error method
        (error: any) => {
            console.log(error);
        } 
    );

  }
  
  ngOnDestroy(): void{
    this.productSub.unsubscribe();
  }

  onDeleteProduct(product: Product){

    this.productService.deleteProduct(product);
  }

}
