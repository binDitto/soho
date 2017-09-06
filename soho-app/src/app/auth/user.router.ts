import { UserProfileComponent } from './profile/profile.component';
import { UserLoginComponent } from './login/login.component';
import { UserRegisterComponent } from './register/register.component';
// REQUIRED
import { Routes, RouterModule } from '@angular/router';

const UserRoutes: Routes = [
  { path: '', redirectTo: 'register', pathMatch: 'full' },
  { path: 'register', component: UserRegisterComponent },
  { path: 'login', component: UserLoginComponent },
  { path: 'profile', component: UserProfileComponent}
];

export const UserRouter = RouterModule.forChild(UserRoutes);
