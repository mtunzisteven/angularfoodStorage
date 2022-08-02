// Shorter TS way of defining a contact class
export class Product{

    constructor (
        public id: string,
        public name: string,
        public amount: string,
        public servings: number,
        public addedData: number,
        public expiryDate: number,
        public _id?: string
    ) { }
} 
