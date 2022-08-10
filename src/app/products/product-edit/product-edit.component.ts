import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Product } from '../product.model';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {

  // the  unedited product
  originalproduct: Product;

  // the edited product
  product: Product = new Product('', '', '', 0, 0, 0);

  // The variable that will manage edit mode
  editMode: boolean = false;

  id: string;

  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
    ) { }

  ngOnInit(): void {

    this.route.params
      .subscribe(
        (params: Params) => {

          // extract the id from th eurl params
          this.id = params['id'];

          console.log(this.id);
          
          // if there is not id found, then we are adding new product thus, turn off edit mode
          if(this.id == undefined || this.id === null){

            // set the value of edit to false.
            this.editMode = false

            return;

          }else{

            // if the value of id was defined, we'll get the specific product
            this.originalproduct = this.productService.getProduct(this.id);
        
            // if there was no specific product fetched using the id, we return
            if(this.originalproduct == undefined || this.originalproduct === null){

              return;

            }

          }
          

          // if we get this far, then we are editing. Turn on editMode
          this.editMode = true;

          console.log(JSON.parse(JSON.stringify(this.originalproduct)));

          // turn the product into a JSON object so it can be used in the form on the template
          this.product = JSON.parse(JSON.stringify(this.originalproduct));
      });

  }

  onSubmit(form: FormGroup){

    // value = form.value // get values from form’s fields
    // newproduct = new product()
    // Assign the values in the form fields to the
    // corresponding properties in the newproduct
    // if (editMode = true) then
    //  productService.updateproduct(originalproduct, newproduct)
    // else
    //  productService.addproduct(newproduct)
    // endIf
    // route back to the '/products' URL 

    const productEditForm = form.value;
    let addedDate = Date.now();
    let expiryDate =  Date.parse(productEditForm.expiryDate);

    let newProduct = new Product(
      this.id,
      productEditForm.name,
      productEditForm.amount,
      productEditForm.servings,
      addedDate,
      expiryDate
      );

    if(this.editMode){
      this.productService.updateProduct(newProduct, this.originalproduct);
    }else{
      this.productService.addProduct(newProduct);
    }
    this.router.navigate(['../','list'], {relativeTo: this.route});

  }

  onCancel(){

    this.router.navigate(['../','list'], {relativeTo: this.route});
    
  }


}
