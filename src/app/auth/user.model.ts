// Shorter TS way of defining a contact class
export class User{

    constructor (
        public id: string,
        public name: string,
        public email: string,
        public familySize: number,
        private _token: string,
        private _tokenExpirationDate: Date,
        public _id?: string

    ) { }

    get token(){

        if(!this._tokenExpirationDate || new Date() > this._tokenExpirationDate){

            return null;

        }

        return this._token;
    }
} 
