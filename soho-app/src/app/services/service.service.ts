import { Injectable, EventEmitter, Input, Output } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';

import { Observable } from 'rxjs';
import 'rxjs/Rx';

// SERVICE MODEL
import { Service } from './service.model';

// ENVIRONMENT
import { environment } from '../../environments/environment';

@Injectable()
export class ServiceService {
  backEnd = environment.backEndUrl;

  services: Service[] = [];



  constructor (
    private http: Http
  ) {}
  // GET
    getServices(){
      return this.http.get(this.backEnd + 'services')
                      .map(
                        ( foundServices ) => {
                          console.log( 'Success: ' + foundServices.json().success + ', ' + foundServices.json().msg );

                          let servicesToTransform = foundServices.json().services;
                          let transformedServices: Service[] = [];

                          for (let service of servicesToTransform ) {
                            transformedServices.push( new Service(
                              service.name,
                              service.price,
                              service.description,
                              service.category,
                              service._id,
                              service.user._id,
                              service.user.userName,
                              service.image,
                              service.createdAt
                            ));
                          }

                          this.services = transformedServices;
                          console.log(this.services.length + ' Services fetched!');
                          return transformedServices;
                        }
                      ).catch( error => {
                        let jsonerr = error.json();
                        console.log( jsonerr.error );
                        console.log('Success: ' + jsonerr.success + ', ' + jsonerr.msg );
                        return Observable.throw( jsonerr );
                      });
    }

  // CREATE
    addService( serviceToAdd: FormData ) {
      let headers = new Headers();
          headers.append('enctype', 'multipart/form-data');
      const queryToVerify = localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';
      return this.http.post(this.backEnd + 'services' + queryToVerify, serviceToAdd, { headers: headers})
                      .map(
                        ( createdServiceRes: Response ) => {

                          const newServiceData = createdServiceRes.json();

                          const newService = new Service(
                            newServiceData.obj.name,
                            newServiceData.obj.price,
                            newServiceData.obj.description,
                            newServiceData.obj.category,
                            newServiceData.obj._id,
                            newServiceData.obj.user._id,
                            newServiceData.obj.user.userName,
                            newServiceData.obj.image,
                            newServiceData.obj.createdAt
                          );

                          this.services.unshift( newService );

                          const newobject = { data: newServiceData, service: newService };
                          return newobject;
                        }
                      ).catch( error => {
                        let jsonerr = error.json();
                        console.log( jsonerr.error );
                        console.log('Success: ' + jsonerr.success + ', ' + jsonerr.msg);
                        return Observable.throw( jsonerr );
                      });
    }

  // EDIT
      @Output() sendEditSignal = new EventEmitter<Service>();

      editService ( serviceToEdit: Service ) {
        this.sendEditSignal.emit( serviceToEdit );
      }

  // UPDATE
    updateService ( serviceToUpdate: FormData, serviceId: String ) {
      let headers = new Headers();
          headers.append('enctype', 'multipart/form-data');
      const queryToVerify = localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';

      return this.http.patch( this.backEnd + 'services/' + serviceId + queryToVerify, serviceToUpdate, { headers: headers })
        .map(updatedServiceRes => updatedServiceRes.json()).catch(
          error => {
          let jsonerr = error.json();
          console.log(jsonerr.error);
          console.log('Success: ' + jsonerr.success + ', ' + jsonerr.msg);
          return Observable.throw(jsonerr);
        });
    }

  // DELETE
    deleteService ( serviceToDelete: Service ) {
      this.services.splice(this.services.indexOf( serviceToDelete ), 1);

      const queryToVerify = localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';

      return this.http.delete( this.backEnd + 'services/' + serviceToDelete.id + queryToVerify )
                      .map(
                        ( deletedServiceRes: Response ) => {
                          const deletedData = deletedServiceRes.json();
                          console.log(this.services);
                          console.log(this.services.length + ' service(s) left in the database!');
                          return deletedData;
                        }
                      );
    }
}
