import { UserNavComponent } from './auth/user-nav.component';
import { HomeComponent } from './home/home.component';

// REQUIRED
import { Routes, RouterModule } from '@angular/router';

const MainRoutes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'users', component: UserNavComponent, loadChildren: './auth/user.module#UserModule' }
];


export const MainRouter = RouterModule.forRoot(MainRoutes);
