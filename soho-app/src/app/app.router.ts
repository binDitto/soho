import { ServiceOutletComponent } from './services/outlet/service-outlet.component';
import { UserNavComponent } from './auth/user-nav.component';
import { HomeComponent } from './home/home.component';

// REQUIRED
import { Routes, RouterModule } from '@angular/router';

const MainRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'users', component: UserNavComponent, loadChildren: './auth/user.module#UserModule' },
  { path: 'services', component: ServiceOutletComponent, loadChildren: './services/service.module#ServiceModule'}
];


export const MainRouter = RouterModule.forRoot(MainRoutes);
