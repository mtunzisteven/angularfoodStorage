import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable} from '@angular/core';
import { map, Subject } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import {User} from '../auth/user.model';

// This injectable argument replaces the need to add the provides inside 
// component.ts file or in the app.module.ts file
@Injectable({
  providedIn: 'root'
})
export class UserService {

  // define the emitter that will emit contact array changes
  // contactChangedEvent = new EventEmitter<Contact[]>();

  // the user that will be retrieved on login
  user: User;

  userId: string;

  auth: boolean;

  emitAuthBoolean = new Subject<boolean>();


  // Maximum user id variable
  maxUserId: number = 0;

  url = "https://food-storage-api.herokuapp.com/user/";
  headers:HttpHeaders;

  constructor(
    private http: HttpClient,
    private authService: AuthService
    ) { }

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

}
