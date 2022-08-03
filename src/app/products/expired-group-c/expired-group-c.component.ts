import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from '../product.model';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-expired-group-c',
  templateUrl: './expired-group-c.component.html',
  styleUrls: ['./expired-group-c.component.css']
})
export class ExpiredGroupCComponent implements OnInit , OnDestroy {
  
  subscription: Subscription;

  products: Product[];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {

    // get products and remove those that have expired using 
    this.products = this.productService.showProductsByExpirationStatus(this.productService.products, 356);

    this.subscription = this.productService.productListChangedEvent
      .subscribe(
        (products: Product[]) =>{

          // remove expired products
          this.products = this.productService.showProductsByExpirationStatus(products, 356);
          
        }
      );

  }

  ngOnDestroy(): void{

    this.subscription.unsubscribe();

  }

  expireWithinYear(products: Product[]){

    return products.filter(product => {

      let difference = Date.parse(product.expiryDate.toString())-Date.now();

      let days = (Math.ceil(difference/ (1000 * 3600 * 24)));

      return days > 92 && days <= 356;

    });
  }

}
