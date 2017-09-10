import { UserService } from '../../auth/user.service';
import { ServiceService } from '../service.service';
import { Service } from '../service.model';
import { Component, OnInit, Input, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
declare const jQuery: any;

@Component({
  selector: 'service-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class ServiceFormComponent implements OnInit {

  @Input() service: Service;
  image: any;
  categories: Array<Object>;


  constructor(
    private router: Router,
    private serviceService: ServiceService
  ) {

    this.categories = [
      { value: 'Manicure' },
      { value: 'Pedicure' },
      { value: 'Artificial Nails' },
      { value: 'Waxing' }
    ];

  }

  ngOnInit() {
    this.serviceService.sendEditSignal.subscribe(
      ( serviceToEditReq: Service ) => this.service = serviceToEditReq
    );
  }

    imageUpEvent( imageEvent: any ) {
      this.image = <File>imageEvent.target.files;
    }

    onSave( form: NgForm ) {
      console.log( form );

      if ( this.service ) {
        // EDIT
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
                                    console.log( serviceEditedRes.message );
                                    this.service = serviceEditedRes;
                                  }
                                );

        // reset form
        this.service = null;

      } else {
        // NEW

        const serviceData = new FormData();
              serviceData.append('serviceImage', this.image[0], this.image[0].name);
              serviceData.append('name', form.value.name);
              serviceData.append('description', form.value.description);
              serviceData.append('price', form.value.price);
              serviceData.append('category', form.value.category);
              console.log('Service Data : ' + serviceData.toString());

              this.serviceService.addService( serviceData )
                                 .subscribe(
                                   createdServiceRes => console.log( createdServiceRes)
                                 );

      }

      this.router.navigateByUrl('/services');
      jQuery('#myModal').modal('hide');

      form.resetForm();

    }

    onClear( form: NgForm ){
      form.resetForm();
      this.service = null;
    }
}
