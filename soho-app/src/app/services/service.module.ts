import { ServiceComponent } from './service/service.component';
import { UserService } from '../auth/user.service';
import { ServiceService } from './service.service';
import { ServiceFormComponent } from './form/form.component';
import { ServiceListComponent } from './list/list.component';
import { ServiceRouter } from './service.router';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ServiceListComponent,
    ServiceFormComponent,
    ServiceComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ServiceRouter,
    FormsModule
  ],
  providers: [
    ServiceService,
    UserService
  ]
})
export class ServiceModule { }
