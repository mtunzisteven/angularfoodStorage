import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from '../product.model';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-expired-products',
  templateUrl: './expired-products.component.html',
  styleUrls: ['./expired-products.component.css']
})
export class ExpiredProductsComponent implements OnInit, OnDestroy {

  subscription: Subscription;

  products: Product[];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    // get products and remove those that have expired using 
    this.products = this.productService.showProductsByExpirationStatus(this.productService.products, 0);

    this.subscription = this.productService.productListChangedEvent
      .subscribe(
        (products: Product[]) =>{

          // remove expired products
          this.products = this.productService.showProductsByExpirationStatus(products, 0);
          
        }
      );

  }

  ngOnDestroy(): void{

    this.subscription.unsubscribe();

  }

  onDeleteProduct(product: Product){

    this.productService.deleteProduct(product);
  }

}
