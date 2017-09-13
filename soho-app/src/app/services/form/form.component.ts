import { UserService } from '../../auth/user.service';
import { ServiceService } from '../service.service';
import { Service } from '../service.model';
import { Component, OnInit, Input, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
declare const jQuery: any;

@Component({
  selector: 'service-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class ServiceFormComponent implements OnInit {

  @Input() service: Service;
  @Input() image: any;
  categories: Array<Object>;


  constructor( private router: Router, private serviceService: ServiceService, private flash: FlashMessagesService ) {

    this.categories = [
      { value: 'Manicure' },
      { value: 'Pedicure' },
      { value: 'Artificial Nails' },
      { value: 'Waxing' }
    ];



  }

  ngOnInit() {
    if ( !this.service) {
      this.serviceService.sendEditSignal.subscribe(serviceToEdit => this.service = serviceToEdit);
    }
  }

  imageUpEvent( imageEvent: any ) { this.image = <File>imageEvent.target.files; }

  onSave( form: NgForm ) {
    console.log( form );

    if ( this.service ) {
      // EDIT
        // this will change the new data;
        this.service.name = form.value.name;
        this.service.description = form.value.description;
        this.service.category = form.value.category;
        this.service.price = form.value.price;

      const serviceToEdit = new FormData();

          if ( this.image ) {
            serviceToEdit.append('serviceImage', this.image[0], this.image[0].name);
          }
            serviceToEdit.append('name', form.value.name);
            serviceToEdit.append('description', form.value.description);
            serviceToEdit.append('category', form.value.category);
            serviceToEdit.append('price', form.value.price);

            this.serviceService.updateService( serviceToEdit, this.service.id )
                               .subscribe(
                                  ( serviceEditedRes ) => {

                                      console.log( serviceEditedRes.service );
                                      this.service = serviceEditedRes.service;
                                      // this.service.image = serviceEditedRes.service.image;
                                      console.log( this.service );
                                      console.log( 'Success: ' + serviceEditedRes.success + ', ' + serviceEditedRes.msg );
                                      
                                      this.flash.show(serviceEditedRes.msg, { cssClass: 'alert-success', timeout: 5000 });
                                      this.router.navigateByUrl('/services');

                                      window.location.reload();
                                      

                                  },
                                  error => {
                                    this.flash.show( error.msg, { cssClass: 'alert-danger', timeout: 5000 });
                                  });

      // reset form
      this.service = null;

    } else {
      // NEW

      const serviceData = new FormData();
        if ( this.image ) {
            serviceData.append('serviceImage', this.image[0], this.image[0].name);

        }
            serviceData.append('name', form.value.name);
            serviceData.append('description', form.value.description);
            serviceData.append('price', form.value.price);
            serviceData.append('category', form.value.category);
            console.log('Service Data : ' + serviceData.toString());

            this.serviceService.addService( serviceData )
                                .subscribe(
                                  (createdServiceRes) => {
                                    console.log(createdServiceRes.service);
                                    console.log('Success: ' + createdServiceRes.data.success + ', ' + createdServiceRes.data.msg);
                                    this.flash.show(createdServiceRes.data.msg, { cssClass: 'alert-success', timeout: 5000 });
                                  },
                                  error => {
                                    this.flash.show( error.msg, { cssClass: 'alert-danger', timeout: 5000 });
                                  });

    }


    jQuery('#myModal').modal('hide');

    form.resetForm();

  }

  onClear( form: NgForm ){
    form.resetForm();
    this.service = null;
  }
}
