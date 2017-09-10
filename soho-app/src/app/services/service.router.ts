import { ServiceListComponent } from './list/list.component';
import { Routes, RouterModule } from '@angular/router';

const ServiceRoutes: Routes = [
  { path: '', component: ServiceListComponent }
];

export const ServiceRouter = RouterModule.forChild(ServiceRoutes);
