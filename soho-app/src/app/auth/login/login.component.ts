import { User } from '../user.model';
import { UserService } from '../user.service';

// REQUIRED
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'login-page',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class UserLoginComponent implements OnInit {
  loginForm: FormGroup;
  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  formData = {
    // email: new FormControl( null, [ Validators.required, Validators.pattern( this.emailRegex )]),
    userName: new FormControl( null, Validators.required),
    password: new FormControl( null, Validators.required )
  };



  constructor ( private router: Router, private userservice: UserService, private flash: FlashMessagesService  ) {}
  ngOnInit () {
    this.loginForm = new FormGroup( this.formData );
  }

    onSubmit() {

      const userToLogin = {
        userName: this.loginForm.value.userName,
        password: this.loginForm.value.password
      };

      this.userservice.login( userToLogin ).subscribe(
        data => {

            this.userservice.storeUserData(data.token, data.user);
            this.flash.show('You are now logged in.', { cssClass: 'alert-success', timeout: 5000 });
            this.router.navigate(['/users/profile']);
          },
          error => {
            console.log( error.msg );
            console.log( error.error);
            this.flash.show( error.msg, { cssClass: 'alert-danger', timeout: 5000 });
            console.log( error.error );
            this.router.navigate(['/users/login']);
          });

      this.loginForm.reset();

    }
}
