import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { ProductService } from '../products/product.service';
import { User } from './user.model';
import { UserService } from './user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  user: User;

  auth = false;

  home = {};

  subcription: Subscription;

  constructor(
    private userService: UserService,
    private productService: ProductService,
    private authService: AuthService

    ) { }

  ngOnInit(): void {

      this.auth = this.userService.auth;

      console.log(this.auth);

      this.subcription = this.authService.userChangedEvent.subscribe(
        (user) =>{
          this.user = user;

          // fetch products for this user and add them to the home object for viewing 

        }
      );
  }

  ngOnDestroy(){
    this.subcription.unsubscribe();
  }



}
