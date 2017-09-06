import { User } from '../user.model';
import { UserService } from '../user.service';

// REQUIRED
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'login-page',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class UserLoginComponent implements OnInit {
  loginForm: FormGroup;
  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  formData = {
    email: new FormControl( null, [ Validators.required, Validators.pattern( this.emailRegex )]),
    password: new FormControl( null, Validators.required )
  };



  constructor ( private router: Router, private userservice: UserService ) {}
  ngOnInit () {
    this.loginForm = new FormGroup( this.formData );
  }

  // FUNCTIONALITY
    onSubmit() {

      const userToLogin = new User(
        this.loginForm.value.email,
        this.loginForm.value.password
      );

      this.userservice.login( userToLogin )
                      .subscribe(
                        ( loginData ) => {
                          localStorage.setItem('token', loginData.token);
                          localStorage.setItem('userId', loginData.user._id);

                          this.router.navigateByUrl('/users/profile');

                          console.log( loginData.user.userName + ': ' + loginData.user._id );
                        },
                        loginError => console.error( loginError )
                      );

      this.loginForm.reset();

    }
}
