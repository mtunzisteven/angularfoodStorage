import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { map, Subject } from 'rxjs';

import { AuthService } from '../auth.service';
import { Product } from './product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  // a better way to emit product changes
  productListChangedEvent = new Subject<Product[]>();

  // Will be used to emit the selected product
  selectedproductEvent = new EventEmitter<Product>();

  // the product that will be retrieved on login
  products = [];

  // const dates_into_integers = dates_as_strings.map(product => new Date(product.expiryData).getTime()) || no errors
  // const dates_into_integers = dates_as_strings.parse(product => Date.parse(product.expiryData)) || may have errors

  // const date_into_strings = dates_as_strings.map(date => new Date(product.expiryData));

  productId: string;

  // Maximum product id variable
  maxproductId: number = 0;

  url = "http://localhost:3000/products/";
  headers:HttpHeaders;

  constructor(
    private http: HttpClient,
    private authService: AuthService
    ) {
    
      this.authService.authenticationIdEmmiter
        .subscribe(
          (authData: any) =>{

            this.productId = authData.id;

            this.headers = new HttpHeaders({
              'Content-Type': 'application/json',
              'Authorization': 'Bearer '+authData.token
            });
          }
        );
  }

  // // fn to add a product into the products array
  getProducts() {

    this.http
      .get(
          this.url, 
          { headers: this.headers }
        )
       // Use pipe below to get correct products
       .pipe(map(fetchedProducts =>{

          fetchedProducts['products'].map(product => {
            product['expiryDate'] = new Date(product['expiryDate']).toISOString().replace('-', '/').split('T')[0].replace('-', '/');
            product['addedDate'] = new Date(product['addedDate']).toISOString().replace('-', '/').split('T')[0].replace('-', '/');
          });


          return fetchedProducts['products'];
        })) 
      .subscribe(
        // success method
        (products: Product[]) => {

          this.products = products;

          this.sortAndSend();

        },
        // error method
        (error: any) => {
            console.log(error);
        } 
    );

    return this.products.slice()

  }

    // fn to add a product into the products array
  addProduct(newProduct: Product) {

    if (!newProduct) {
      console.log('No new contact detected!');
      return;
    }

    // make sure id of the new product is empty
    newProduct.id = '';

    // add to database
    this.http.post<{ message: string, product: Product }>(this.url,
      newProduct,
      { headers: this.headers })
      .subscribe(
        (responseData) => {
          // add new product to products
          this.products.push(responseData.product);
          this.sortAndSend();
        }
      );

  }

  updateProduct(newProduct: Product, originalProduct: Product) {
    
    if (!originalProduct || !newProduct) {
      return;
    }

    const pos = this.products.findIndex(d => d.id === originalProduct.id);

    if (pos < 0) {
      return;
    }

    // set the id of the new product to the id of the old product
    newProduct.id = originalProduct.id;

    // update database
    this.http.put(this.url + originalProduct.id,
      newProduct, { headers: this.headers })
      .subscribe(
        (response: Response) => {
          this.products[pos] = newProduct;
          this.sortAndSend();
        }
      );
  }

  // Method used to delete a product from the products array and in the db
  deleteProduct(product: Product) {
    
    if (!product) {
      return;
    }

    const pos = this.products.findIndex(d => d.id === product.id);

    if (pos < 0) {
      return;
    }

    // delete from database
    this.http.delete(
      this.url + product.id,
      {headers: this.headers}
      )
      .subscribe(
        (response: Response) => {
          this.products.splice(pos, 1);
          this.sortAndSend();
        }
      );
  }

  // get a single product using an string type id
  getProduct(id: string): Product{

    // declare a product or null type variable and assign the value of null to it
    let returnValue: Product | null = null;

    // loop through each product in the products array
    this.products.forEach(product => {

      // if you find a product's id that is equal to the id n the arg
      // change variable value & set it equal to that product 
      if(product.id == id ){
        
        returnValue = product;

      }
    });

    return returnValue;
  }

  // sort Products
  sortAndSend(){

    this.products.sort((a, b) => {
      if(+a.id < +b.id){
        return -1;
      }else{
        return 1;
      }
    });

    this.productListChangedEvent.next(this.products.slice());
  }

  // display products by expiration status
  showProductsByExpirationStatus(products: Product[], max: number){

    return products.filter(product => {

      let difference = Date.parse(product.expiryDate.toString())-Date.now();

      let days = (Math.ceil(difference/ (1000 * 3600 * 24)));

      switch(max){
        case 0: // expired
          return days <= 0;
        case 31: // expire within 1 month
          return days > 0 && days <= 30;
        case 92: // expire within 3 months
          return days > 30 && days <= 92;
        case 356: //expire within year
          return days > 92 && days <= 365; 
        default:
          return days > 0
      }

    });
  }
}


