import { Service } from '../service.model';
import { UserService } from '../../auth/user.service';
import { ServiceService } from '../service.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'service-list',
  template: `
    <service-form *ngIf="isAdmin()"></service-form>
    <service *ngFor="let service of services" [service]="service">Loading Services...</service>
  `,
  styleUrls: ['./list.component.css']
})
export class ServiceListComponent implements OnInit {
  @Input() services: Service[];
  admin: Boolean;
  currentUser;

  constructor(
    private serviceService: ServiceService,
    private userService: UserService
  ) {
    this.currentUser = localStorage.getItem('userId') || null;
  }

  ngOnInit() {

    if ( this.currentUser ) {
      this.userService.getProfile().subscribe(
        ( profile ) => {
          this.admin = profile.admin;
          console.log('Admin: ' + profile.admin);
        }
      )
    }

      this.serviceService.getServices().subscribe(
        (services: Service[]) => {
          this.services = services;
        }
      )

  }

  isAdmin() {
    if (this.currentUser) {
      if (this.admin) {
        return true
      }
    } else {
      return false
    }
  }
}
