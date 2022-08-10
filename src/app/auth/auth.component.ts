import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/auth/auth.service';
import { User } from './user.model';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit{

  id = '';
  email = '';
  password = '';
  
  // initial value to avert error name undefined
  user = new User('', '', '', 1, '', new Date());

  message = null;
  status = false;

  login = true;
  isLoading = false; // turn off loading animation


  subscription: Subscription;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
    ) { 
      // turn on auth so *ngIf auth works
      // must be done here and not in the init fn
      this.userService.auth = true;
    }

  ngOnInit(): void {

    this.subscription = this.authService.userChangedEvent.subscribe(
      (user) =>{

        this.isLoading = true; // turn on loading animation

        this.user = user;

        this.isLoading = false; // turn on loading animation


      }
    );

    console.log(this.route.snapshot.url[0].path);

    // decide whether login or signup url
    this.login = this.route.snapshot.url[0].path == 'login'? true:false;

  }

  ngOnDestroy(){
    this.subscription.unsubscribe();

    // turn off auth so *ngIf auth works
    this.userService.auth = false;
  }

  
  onSubmit(form: FormGroup){

    const userForm = form.value;

    this.isLoading = true; // turn on loading animation

    if(this.login){

      this.authService.signIn(userForm.email, userForm.password)
      .subscribe(
        // success method
        (authData: any) => {

          this.message = authData.message;
          this.status = authData.status;

          // status of auth data true if it is successful
          if(this.status){

            // reset form values without emptying them(form.reset())
            userForm.email = '';
            userForm.password = '';

            this.status = false;
            this.isLoading = false; // turn off loading animation 

            this.router.navigate(['../../','home']); // route use to home page on successful login

          }

        },errorMessage =>{

          this.message = errorMessage;
          console.log(errorMessage);
          this.isLoading = false; // turn off loading animation 

        });

    }else{

      let newUser = new User(
        this.id,
        userForm.name,
        userForm.email,
        userForm.familySize,
        '',
        new Date()
        );

        this.subscription = this.authService.signUp(newUser)
          .subscribe(
            (data) =>{

              this.message = data.message;
              this.status = data.status;

              // status of data true if it is successful
              if(this.status){

                // reset form values without emptying them(form.reset())
                userForm.name = '';
                userForm.email = '';
                userForm.password = '';
                userForm.familySize = 1;

                this.status = false;
                this.isLoading = false; // turn off loading animation 

              }
        
            }, errorMessage =>{

              this.message = errorMessage;
              console.log(errorMessage);
              this.isLoading = false; // turn off loading animation 

            });
    }
    
  }

  onCancel(){

    this.router.navigate(['../../']);
    
  }

  onSwitch(){
    this.login = !this.login;
  }

}

