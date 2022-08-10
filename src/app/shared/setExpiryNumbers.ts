import { Product } from "../products/product.model";
import { User } from "../auth/user.model";

// sets and returns expiry numbers in days for each expiry <period> within group
export function  setExpiryNumbers(products: Product[], user: User){

    const expiryNumbers = {};

    // remove expired products
    let activeProducts = products.filter(product => {

      let difference = Date.parse(product.expiryDate.toString())-Date.now();

      return (Math.ceil(difference/ (1000 * 3600 * 24))) > 0;

    });


    // filter for items expiring in 1 month: 30 days or less
    let  expireInMonth = activeProducts.filter(product =>{

      let difference = Date.parse(product.expiryDate.toString())-Date.parse(product.addedDate.toString());

      return (Math.ceil(difference/ (1000 * 3600 * 24))) < 31;

    })

    // filter for items expiring in 3 month: 92 days or less
    let  expireInThreeMonths = activeProducts.filter(product =>{
      let difference = Date.parse(product.expiryDate.toString())-Date.parse(product.addedDate.toString());

      return (Math.ceil(difference/ (1000 * 3600 * 24))) < 93;
    })

    // filter for items expiring in 1 year: 365 days or less
    let  expireInYear = activeProducts.filter(product =>{
      let difference = Date.parse(product.expiryDate.toString())-Date.parse(product.addedDate.toString());

      return (Math.ceil(difference/ (1000 * 3600 * 24))) <= 365;
    })

    // initialize servingsLeft
    expiryNumbers['servingsLeft'] = 0;

    // get the total number of servings   
    activeProducts.forEach(product => {

        expiryNumbers['servingsLeft'] += product.servings;

    });

    // only access user data if we are logged in
    if(user){

      // divide the numbe rof servings remaining by 3 meals a day
      // user is nested in user obj
      expiryNumbers['servingsLeft'] = Math.round((expiryNumbers['servingsLeft']/3)/user.familySize);

    }



    // set the number of items expiring in 1 month, 3 months, and 1 year
    expiryNumbers['month'] =expireInMonth.length;
    expiryNumbers['threeMonths'] =expireInThreeMonths.length;
    expiryNumbers['year'] =expireInYear.length;

    return expiryNumbers;
}