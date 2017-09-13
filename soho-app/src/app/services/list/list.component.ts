import { Service } from '../service.model';
import { UserService } from '../../auth/user.service';
import { ServiceService } from '../service.service';
import { Component, OnInit, Input } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'service-list',
  template: `
    <service-form *ngIf="isAdmin() && currentUser"></service-form>
    <service *ngFor="let service of services" [service]="service">Loading Services...</service>
  `,
  styleUrls: ['./list.component.css']
})
export class ServiceListComponent implements OnInit {

  @Input() services: Service[];

  admin: Boolean;
  currentUser;

  constructor( private serviceService: ServiceService, private userService: UserService, private flash: FlashMessagesService ) {
    this.currentUser = localStorage.getItem('userId') || null;
  }

  ngOnInit() {

    if ( this.currentUser ) { this.userService.getProfile().subscribe(
        ( profile ) => {
          this.admin = profile.admin;
          console.log('Admin: ' + profile.admin);
        }
      )
    }

    if ( this.serviceService.services ) {
      this.serviceService.getServices().subscribe( services => this.services = services,
                                                   error => {
                                                     this.flash.show( error.msg, { cssClass: 'alert-danger', timeout: 5000} );

                                                   } );
    }
  }
  isValidUser(){
    let status = this.userService.isLoggedIn();
    if ( status ) {
      console.log('Valid User.');
    } else {
      console.log('Invalid User.');
    }

    return status;
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
