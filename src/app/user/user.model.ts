// Shorter TS way of defining a contact class
export class User{

    constructor (
        public id: string,
        public name: string,
        public email: string,
        public password: string,
        public familySize: number,
        public _id?: string
    ) { }
} 
