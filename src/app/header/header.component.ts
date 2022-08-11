import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  isAuthenticated = false;

  constructor(
    private authService: AuthService,
    private route: Router
    ) { }

  ngOnInit(): void {
    
    // this user observable is special and will stop after the value is retrieved
    this.authService.user
      .subscribe(
        (user) =>{

          // when user == null, isAuthenticated = false
          this.isAuthenticated = !!user; //same as: !user? false:true;

        }
      );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onLoggOut(){
    this.authService.logout();
  }

}
