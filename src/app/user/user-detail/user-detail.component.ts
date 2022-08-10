import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { ProductService } from 'src/app/products/product.service';
import { User } from '../../auth/user.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {

  user: User;

  home = {};

  subcription: Subscription;

  constructor(
    private userService: UserService,
    private authService: AuthService
    ) { }

  ngOnInit(): void {

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
