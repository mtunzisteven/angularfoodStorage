// Shorter TS way of defining a contact class
export class User{

    constructor (
        public id: string,
        public name: string,
        public email: string,
        public phone: string,
        public imageUrl: string,
        public _id?: string
    ) { }
} 