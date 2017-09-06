import { UserProfileComponent } from './profile/profile.component';
import { UserLoginComponent } from './login/login.component';
import { UserService } from './user.service';
import { UserRouter } from './user.router';
import { UserRegisterComponent } from './register/register.component';

// REQUIRED
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    UserRegisterComponent,
    UserLoginComponent,
    UserProfileComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UserRouter
  ],
  providers: [
    UserService
  ]
})
export class UserModule {}
