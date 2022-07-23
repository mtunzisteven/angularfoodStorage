import { HttpClient, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { EventEmitter, Injectable } from "@angular/core";
import { User } from "./user/user.model";

// This injectable argument replaces the need to add the provides inside 
// component.ts file or in the app.module.ts file
@Injectable({
  providedIn: 'root'
})
export class AuthService{

  authenticationIdEmmiter = new EventEmitter<any>();

  authData:{
    token: string, 
    id:string
  };

  url = "http://localhost:3000/user";
  headers = new HttpHeaders({'Content-Type': 'application/json'});

  token: string;

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
  }
