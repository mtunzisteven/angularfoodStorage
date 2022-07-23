import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable} from '@angular/core';
import { map, Subject } from 'rxjs';

import { AuthService } from '../auth.service';
import {User} from './user.model';

// This injectable argument replaces the need to add the provides inside 
// component.ts file or in the app.module.ts file
@Injectable({
  providedIn: 'root'
})
export class UserService {

  // define the emitter that will emit contact array changes
  // contactChangedEvent = new EventEmitter<Contact[]>();

  // a better way to emit user changes
  userChangedEvent = new Subject<User>();

  // the user that will be retrieved on login
  user: User;

  userId: string;

  // Maximum user id variable
  maxUserId: number = 0;

  url = "http://localhost:3000/user/";
  headers:HttpHeaders;

  constructor(
    private http: HttpClient,
    private authService: AuthService
    ) {
    
      this.authService.authenticationIdEmmiter
        .subscribe(
          (authData: any) =>{

            this.userId = authData.id;

            this.headers = new HttpHeaders({
              'Content-Type': 'application/json',
              'Authorization': 'Bearer '+authData.token
            });

            this.getUser(authData.id, this.headers);

          }
        );
  }

  signIn(email: string, password: string){ 

    this.authService.signIn(email, password);

  } 

  // // fn to add a contact into the contacts array
  signUp(newUser: User) {

    if (!newUser) {
      return;
    }

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // add to database
    this.http.post<{ message: string}>(this.url+'/signup',
      newUser,
      { headers: headers })
      .subscribe(
        (responseData) => {
          // add new contact to contacts
          console.log(responseData);
        }
      );

  }

  updateUser(familySize: number) {
    
    let postData = {familySize: familySize};

    let success = false;

    // update database
    this.http.put(this.url + this.user.id,
        postData,
        { headers: this.headers })
      .subscribe(
        (response: Response) => {
          console.log(response);

          success = true;
        }
      );

      return success;
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

}
