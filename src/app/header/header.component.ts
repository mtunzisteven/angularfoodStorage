import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { Subscription } from 'rxjs';

import { User } from '../user/user.model'
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  user: User;

  subscription: Subscription;

  constructor(private userService: UserService) { }

  ngOnInit(): void {

    this.subscription = this.userService.userChangedEvent
      .subscribe(
        (user) =>{
          this.user = user;
        }
      );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
