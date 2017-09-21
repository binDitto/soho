import { Service } from '../service.model';
import { UserService } from '../../auth/user.service';
import { ServiceService } from '../service.service';
import { Component, OnInit, Input } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'service-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ServiceListComponent implements OnInit {

  @Input() services: Service[]= [];

  @Input() pedicures: Service[]= [];
  @Input() manicures: Service[]= [];
  @Input() artificial: Service[]= [];
  @Input() waxing: Service[]= [];

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
      this.serviceService.getServices().subscribe( (services: Service[]) => {
          console.log(services.length);
          console.log(services);
          console.log(services[0]);
        // this.services = services
        for ( let i = 0; i < services.length; i++ ){
          this.services.push(services[i]);
          if ( services[i].category === 'Pedicure'){
            this.pedicures.push(services[i]);
          } else if ( services[i].category === 'Manicure') {
            this.manicures.push(services[i]);
          } else if ( services[i].category === 'Artificial Nails') {
            this.artificial.push(services[i]);
          } else if ( services[i].category === 'Waxing') {
            this.waxing.push(services[i]);
          }
        }
        console.log(this.services);
      },
      error => {
        this.flash.show( error.msg, { cssClass: 'alert-danger', timeout: 5000} );

      } );
    }
  }


  isValidUser(){
    let status = this.userService.isLoggedIn();
    if ( status === true ) {
      console.log('Valid User.');

    } else {
      console.log('Invalid User.');
      this.flash.show('User login expired, please sign in to add service.', { cssClass: 'alert-danger', timeout: 5000 });
    }

    return status;
  }
  isLoggedIn(){
    return this.userService.isLoggedIn();
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
