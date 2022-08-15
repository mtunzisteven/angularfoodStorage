import { Pipe, PipeTransform } from '@angular/core';
import { Product } from 'src/app/products/product.model';

@Pipe({
  name: 'FilterPipe'
})
export class FilterPipe implements PipeTransform {

  transform(product: Product[], term: string): Product[] {

    let searchResult: Product[] = [];

    if(term && term.length > 0){

      searchResult = product.filter(
          (product:Product) =>product.name.toLocaleLowerCase().includes(term.toLowerCase())
        );
        
    }

    if(searchResult.length != 0){
      return searchResult;
    }else{
      return product;
    }
  }

}
