import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { exhaustMap, map, Subject, take } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
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
  products: Product[];

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
    ) {}

  // fn to add a product into the products array
  fetchProducts() {

    // the http observable is returned and subscribed to where this fn is called
    return this.http
        .get(
            this.url, 
            { headers: this.headers }
          )
          // Use pipe below to get correct products
        .pipe(
          map(fetchedProducts =>{
            
            // Change the date products were added from integer to date yyyy/mm/dd
            fetchedProducts['products'].map(product => {

              product['expiryDate'] = new Date(product['expiryDate']).toISOString().replace('-', '/').split('T')[0].replace('-', '/');
              product['addedDate'] = new Date(product['addedDate']).toISOString().replace('-', '/').split('T')[0].replace('-', '/');

            });

            this.products = fetchedProducts['products'];

            // sort products
            this.sortAndSend();

            // emit changes to product list
            this.productListChangedEvent.next(this.products.slice());

            // what the observable will return when subscribed to
            return this.products.slice();

        })) 

  }

  // get the products list that was fetched from the database
  getProducts(){

    // fetch the products from the db if they weren't already
    if(!this.products){
      this.fetchProducts()
      .subscribe((products) =>{

        return products;

      });
    }

    // sort products
    this.sortAndSend();


    // return the list of products requested
    return this.products.slice();

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

          // emitting this updated products list
          this.productListChangedEvent.next(this.products.slice());
        }
      );

  }

  // fn to update product from the db
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

    // convert dates to timestamps: integer
    // newProduct.addedDate = new Date(newProduct.addedDate).getTime();
    newProduct.expiryDate = new Date(newProduct.expiryDate).getTime();

    console.log(newProduct);
    console.log(new Date(newProduct.expiryDate).getTime());
        
    // update database
    this.http.put(
        this.url + originalProduct.id,
        newProduct, 
        { headers: this.headers }
      )
      .subscribe(
        (response: Response) => {
          this.products[pos] = newProduct;
          this.sortAndSend();

          // emitting this updated products list
          this.productListChangedEvent.next(this.products.slice());
        });
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

          // emitting this updated products list
          this.productListChangedEvent.next(this.products.slice());
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

    // filter products based on their expiry date in days remaining
    return products.filter(product => {

      // time between expiry date and today
      let difference = Date.parse(product.expiryDate.toString())-Date.now();

      // convert date to days
      let days = (Math.ceil(difference/ (1000 * 3600 * 24)));

      // return all products whose days left before expiry is according to logic below
      switch(max){
        case 0: // expired
          return days <= 0;
        case 31: // expire within 1 month
          return days > 0 && days <= 30;
        case 93: // expire within 3 months
          return days > 31 && days <= 92;
        case 365: //expire within year
          return days > 93 && days <= 365; 
        default:
          return days > 0
      }

    });
  }
}


