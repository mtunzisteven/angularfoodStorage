import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from '../product.model';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-expired-group-b',
  templateUrl: './expired-group-b.component.html',
  styleUrls: ['./expired-group-b.component.css']
})
export class ExpiredGroupBComponent implements OnInit , OnDestroy {
  
  subscription: Subscription;

  products: Product[];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {

    // get products and remove those that have expired using 
    this.products = this.productService.showProductsByExpirationStatus(this.productService.products, 92);

    this.subscription = this.productService.productListChangedEvent
      .subscribe(
        (products: Product[]) =>{

          // remove expired products
          this.products = this.productService.showProductsByExpirationStatus(products, 92);
          
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
