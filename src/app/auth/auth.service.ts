import { HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { EventEmitter, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, map, Subject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";

import { User } from "./user.model";

// This injectable argument replaces the need to add the provides inside 
// component.ts file or in the app.module.ts file
@Injectable({
  providedIn: 'root'
})
export class AuthService{
  
  // a better way to emit user changes
  userChangedEvent = new Subject<User>();

  url = "http://localhost:3000/user/";
  headers = new HttpHeaders({'Content-Type': 'application/json'});

  token: string;

  // timer that checks the expiration of the token
  private tokenExpirationTimer: any;

  // subject to be used to next user data across app.
  // user =  new Subject<User>();
  // The behavior type of subject still provides you with the prviously emitted value
  // even if you did not subscribe to it but are fetching it on demand
  // The arg is the initial value of the subject being emitted> User
  // null is a valid replacement for User as an initial value:
  user =  new BehaviorSubject<User>(null); 


  constructor(
    private http: HttpClient,
    private route: Router
    ) { }

  // fn to add new user to db
  signUp(newUser: User) {

    if (!newUser) {
      return;
    }

    // add to database
    return this.http.post<{ message: string, status: boolean}>(this.url+'/signup',
      newUser,
      { headers: this.headers })
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

    return this.http.post<{token: string, user: User, _tokenExpirationDate: Date}>(
          this.url+'/login', 
          postData,
          { headers: this.headers })
          .pipe(
            map(resData => {
              resData.user._id = ''; // remove ids

              return resData;
            }),
            catchError(this.handleError),
            tap(resData => {this.handleAuthentication(resData.user, resData.token, resData._tokenExpirationDate)})
          ); // use private error handling function
  }

  // logging out a user
  logout(){
    this.user.next(null);

    // since logout can be carried out from multiple places in the app
    // add routing in this part
    this.route.navigate(['/auth']);

    // clear userData stored in the browser local storage 
    localStorage.removeItem('userData');

    // if timer not expired we clear it, if it already is, we wouldn't be able to
    if(this.tokenExpirationTimer){

      // clear timer
      clearTimeout(this.tokenExpirationTimer);
    }

    // whether expired or clear, we set it back to null
    this.tokenExpirationTimer = null;
  }

  // fn to logg user in after reload if they were logged in
  autoLogin(){



    // get user from storage and convert it back to obj, but simple obj, not user obj
    const user: {
      // let Angular know what tupe of data will come from userData in localStorage
      //
       id: string,
       name: string,
       email: string,
       familySize: number,
       _token: string,
       _tokenExpirationDate: string

    } = JSON.parse(localStorage.getItem('userData'));

    // simply return if user was not found in local storage
    if(!user){
      return;
    }

    // create user obj using userData fetched from localStorage
    const loadedUser = new User(
      user.id,
      user.name,
      user.email,
      user.familySize,
      user._token,
      new Date(user._tokenExpirationDate)
    );

    // Assign user back through Behavior subject only when token is valid: truish
    if(loadedUser.token){

      this.user.next(loadedUser);

    // set auto logout timer when user auto logs in, but recalculate it by minusing
    // current time from token expiry time that was set in the API part of application
    this.autologout(new Date(user._tokenExpirationDate).getTime() - new Date().getTime());
    
    }

  }

  // fn to auto log out user when token expires
  autologout(expirationDuration: number){

    // set timeout fn that is called whenever the duration lapses
    // and assign the timeout to timer variable that can be cleared
    // manually whenever the user logs out
    this.tokenExpirationTimer = setTimeout(() =>{
      // set logout fn at the timeout fn
      this.logout();
      }, expirationDuration);

  }

  private handleAuthentication(userdata, token, _tokenExpirationDate){
    
    // get expiration time for loggin
    const expirationDate = new Date(_tokenExpirationDate);

    const user = new User(
      userdata.id,
      userdata.name,
      userdata.email,
      userdata.familySize,
      token,
      expirationDate
    );

    // emit the user auth data
    this.user.next(user);

    // set auto logout timer when user auto logs in, but recalculate it by minusing
    // current time from token expiry time that was set in the API part of application
    this.autologout(new Date(expirationDate).getTime() - new Date().getTime());

    // to persist the user auth past page reloads, we store the user in 
    // browser local storage in a string format and will retieve it & convert it back to an obj
    localStorage.setItem('userData', JSON.stringify(user));
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