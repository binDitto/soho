import { UserService } from '../user.service';
import { User } from '../user.model';
// REQUIRED
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'register-page',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class UserRegisterComponent implements OnInit {
  display = 'none';
  registerForm: FormGroup;
  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  formData = {
    email: new FormControl( null, [ Validators.required, Validators.pattern( this.emailRegex )] ),
    password: new FormControl( null, Validators.required ),
    firstName: new FormControl( null, Validators.required ),
    lastName: new FormControl( null, Validators.required ),
    userName: new FormControl( null, Validators.required )
  };

  constructor (
    private userservice: UserService,
    private router: Router
  ) {}

  ngOnInit () {
    this.registerForm = new FormGroup( this.formData );
  }

  // FUNCTIONALITY
    onSubmit(){
      const userToMake: User = new User(
        this.registerForm.value.email,
        this.registerForm.value.password,
        this.registerForm.value.firstName,
        this.registerForm.value.lastName,
        this.registerForm.value.userName
      );
      this.userservice.register( userToMake )
                      .subscribe(
                        createdUserRes => console.log( createdUserRes ),
                        error => console.error( error )
                      );

      this.registerForm.reset();
      this.router.navigate(['/users', '/login']);
    }

  // CLOSING MODAL WHEN IT'S OPENED
    onHandled(){
      this.display = 'none';
    }
}
