import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from './user/user.model';
import { UserService } from './user/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{

  subcription: Subscription;

  user: User;

  constructor(private userService: UserService){
    
  }

  ngOnInit(){
    
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

  // const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  // const firstDate = new Date(2008, 1, 12);
  // const secondDate = new Date(2008, 1, 22);

  // const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));

  
}
