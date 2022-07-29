import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { User } from '../user/user.model';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  user: User;

  subscription: Subscription;

  month = 2;
  threeMonths = 5;
  year = 1;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
    ) { }

  ngOnInit(): void {

    this.user = this.authService.user;

    console.log('dashed user: ');
    console.log(this.user);

    this.subscription = this.authService.userChangedEvent.subscribe(
      (user) =>{
        this.user = user;

      }
    );
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  onSelectProfile(){

  }

  onSelectProducts(){

  }

}
