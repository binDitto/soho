import { Service } from '../service.model';
import { ServiceService } from '../service.service';

import { Component, OnInit, Input, Output } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent implements OnInit {
  @Input() service: Service;

  constructor(
    private serviceService: ServiceService, private flash: FlashMessagesService
  ) { }

  ngOnInit() { }

    belongsToUser(){
      return localStorage.getItem('userId') == this.service.userId;
    }

    onEdit() {
      // event.preventDefault();
      this.serviceService.editService( this.service );
    }

    onDelete(){
      event.preventDefault();
      this.serviceService.deleteService( this.service )
                         .subscribe(
                           deletedServiceRes => {
                             console.log ( 'Service named ' + deletedServiceRes.obj.name + ' was deleted!');
                             this.flash.show( deletedServiceRes.msg, { cssClass: 'alert-danger', timeout: 5000 });
                          }
                         );
    }

}
