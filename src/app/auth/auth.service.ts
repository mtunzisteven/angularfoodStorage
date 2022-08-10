import { HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { EventEmitter, Injectable } from "@angular/core";
import { BehaviorSubject, map, Subject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";

import { User } from "./user.model";

// This injectable argument replaces the need to add the provides inside 
// component.ts file or in the app.module.ts file
@Injectable({
  providedIn: 'root'
})
export class AuthService{

  authenticationIdEmmiter = new EventEmitter<any>();

  
  // a better way to emit user changes
  userChangedEvent = new Subject<User>();

  authData:{
    token: string, 
    id:string
  };

  url = "http://localhost:3000/user/";
  headers = new HttpHeaders({'Content-Type': 'application/json'});

  token: string;

  // subject to be used to next user data across app.
  // user =  new Subject<User>();
  // this type of subject still provides you with the prviously emitted value
  // even if you did not subscribe to it but are fetching it on demand
  // The arg is the initial value of the subject being emitted> User
  // null is a valid replacement for User as an initial value:
  user =  new BehaviorSubject<User>(null); 


  constructor(private http: HttpClient) { }

  // fn to add new user to db
  signUp(newUser: User) {

    if (!newUser) {
      return;
    }

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // add to database
    return this.http.post<{ message: string, status: boolean}>(this.url+'/signup',
      newUser,
      { headers: headers })
      .pipe(catchError(this.handleError)); // use private error handling function
  }
  
   // fn to login into user account
  signIn(email: string, password: string){ 

    if (!email || !password) {
      return;
    }

    let postData = {
      email: email,
      password: password
    }

    return this.http.post<{token: string, user: User, status: boolean}>(
          this.url+'/login', 
          postData,
          { headers: this.headers })
          .pipe(
            map(resData => {
              resData.user._id = ''; // remove ids

              return resData;
            }),
            catchError(this.handleError),
            tap(resData => {this.handleAuthentication(resData.user, resData.token)})
          ); // use private error handling function
  }

  // logging out a user
  logout(){
    this.user = null;
    this.token = '';
  }

  private handleAuthentication(userdata, token){

    // create expiration time for loggin
    const expirationDate = new Date(
      new Date().getTime() + (59 * 60 * 1000) // now plus 1 hour minus 1 minute(59 min instead of 60)
    );

    const user = new User(
      userdata.id,
      userdata.name,
      userdata.email,
      userdata.familySize,
      token,
      expirationDate
    );

    this.user.next(user);
  }

  private handleError(errorRes: HttpErrorResponse){

    let errorMessage = "An unknown error occured!";

    if(!errorRes.error){
      return throwError(errorMessage);
    }

    errorMessage = errorRes.error.message;

    return throwError(errorMessage);

  }
}