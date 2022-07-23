import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
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

  dashboard = {};

  subcription: Subscription;

  constructor(
    private userService: UserService,
    private productService: ProductService,
    ) { }

  ngOnInit(): void {

      this.subcription = this.userService.userChangedEvent.subscribe(
        (user) =>{
          this.user = user;

          // fetch products for this user and add them to the dashboard object for viewing 

        }
      );
  }

  ngOnDestroy(){
    this.subcription.unsubscribe();
  }



}
