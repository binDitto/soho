import { Injectable, EventEmitter } from '@angular/core';
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

  private services: Service[] = [];

  constructor (
    private http: Http
  ) {}
  // GET
    getServices(){
      return this.http.get(this.backEnd + 'services')
                      .map(
                        ( servicesDataRes: Response ) => {
                          console.log( servicesDataRes.json().message );

                          let servicesToTransform = servicesDataRes.json().obj;
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
                      )
                      .catch(
                        ( error: Response ) => {
                          return Observable.throw(error.json());
                        }
                      );
    }

  // CREATE
    addService( serviceToAdd: FormData ) {
      const queryToVerify = localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';
      const multipartHeaders = new Headers({ 'enctype' : 'multipart/form-data' });

      return this.http.post(this.backEnd + 'services' + queryToVerify, serviceToAdd, { headers: multipartHeaders})
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
                          return newService;
                        }
                      )
                      .catch(
                        ( error: Response ) => {

                          return Observable.throw(error.json());
                        }
                      );
    }

  // EDIT
      sendEditSignal = new EventEmitter<Service>();

      editService ( serviceToEdit: Service ) {
        this.sendEditSignal.emit( serviceToEdit );
      }

  // UPDATE
    updateService ( serviceToUpdate: FormData, serviceId: String ) {
      const queryToVerify = localStorage.getItem('token') ? "?token=" + localStorage.getItem('token') : '';
      const multipartHeader = new Headers ({ 'enctype' : 'multipart/form-data' });

      return this.http.patch( this.backEnd + 'services/' + serviceId + queryToVerify, serviceToUpdate, { headers: multipartHeader })
                      .map(
                        ( updatedServiceRes: Response ) => {
                          const updatedService = updatedServiceRes.json();
                          return updatedService;
                        }

                      )
                      .catch(
                        ( error: Response ) => Observable.throw(error.json())
                      );
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
                      )
                      .catch(
                        ( error: Response ) => Observable.throw(error.json())
                      );
    }
}
