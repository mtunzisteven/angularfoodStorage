import { HttpClient, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { EventEmitter, Injectable } from "@angular/core";
import { map, Subject } from "rxjs";
import { User } from "./user/user.model";

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

  user: User;

  constructor(private http: HttpClient) { }

 
  signIn(email: string, password: string){ 

    let postData = {
      email: email,
      password: password
    }

    this.http.post<{token: string, user: User}>(
          this.url+'/login', 
          postData,
          { headers: this.headers }
        )
      .subscribe(
        // success method
        (authData: any) => {

          this.authData = authData;

          console.log(authData);

          this.token = this.authData.token;

          this.authenticationIdEmmiter.emit(this.authData);
        },
        // error method
        (error: any) => {
            console.log(error);
        } 
      );
    }

  // function to get the user
  getUser(id, headers){

    this.http
      .get<User>(
        this.url+id,
        { headers: headers }
      )
      .pipe(map(userData =>{
          userData._id = '';

          this.user = userData;

          return userData;
        }
      ))
    .subscribe(
      // success method
      (userData: any) => {

        this.userChangedEvent.next(userData);

      },
      // error method
      (error: any) => {
          console.log(error);
      } 
    );

      return this.user;

  }

  // logging out a user
  logout(){
    this.user = null;
    this.token = '';

  }
}