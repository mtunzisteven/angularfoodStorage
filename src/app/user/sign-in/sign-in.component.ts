import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { User } from '../user.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  email = '';
  password = '';

  user: User;

  subscription: Subscription;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
    ) { }

  ngOnInit(): void {

    this.subscription = this.authService.userChangedEvent.subscribe(
      (user) =>{
        this.user = user;

        this.router.navigate(['../../', 'products'], {relativeTo:this.route});

      }
    );
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  
  onSubmit(form: FormGroup){

    const signInForm = form.value;

    this.userService.signIn(signInForm.email, signInForm.password);
    
  }

  onCancel(){

    this.router.navigate(['../../']);
    
  }

}
