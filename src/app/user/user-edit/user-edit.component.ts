import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { User } from '../user.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {

  isEdit: boolean = true;

  // initial value to avert error name undefined
  user = new User('', '', '', '', 0);

  id: string = '';

  subcription: Subscription;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
    ) { }

  ngOnInit(): void {

    this.route.params
      .subscribe(
        (params: Params) => {

          this.id = params['id'];
          
          // if the id is not found, then we are not editing
          if(this.id == undefined || this.id === null){

            this.isEdit = false

            return;

          }
              
          // this.user = this.userService.getUser(this.id);
      
          // if the user is not logged in, nothing to edit
          if(this.user == undefined || this.user === null){

            return;

          }

          // if we come this far, we are editing indeed
          this.isEdit = true;
          
      });

      this.subcription = this.authService.userChangedEvent.subscribe(
        (user) =>{
          this.user = user;
        }
      );


  }

  ngOnDestroy(){
    this.subcription.unsubscribe();
  }

  onSubmit(form: FormGroup){

    const userForm = form.value;


    if(this.isEdit){

      let login = this.userService.updateUser(userForm.familySize);

      login? this.router.navigate(['../signin'], {relativeTo: this.route}) : this.router.navigate(['../../'], {relativeTo: this.route});;

    }else{

      let newUser = new User(
        this.id,
        userForm.name,
        userForm.email,
        userForm.password,
        userForm.familySize,
        );

      this.userService.signUp(newUser);
    }

    this.router.navigate(['../../'], {relativeTo: this.route});

  }

  onCancel(){

    this.router.navigate(['../../']);
    
  }

}
