// REQUIRED
import { Injectable, EventEmitter, Output } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';

// ADDITIONAL OPERATORS
import { Observable } from 'rxjs';
import 'rxjs/Rx';

// IMPORT BACK END ENVIRONMENT
import { environment } from '../../environments/environment';

// IMPORT USER MODEL
import { User } from './user.model';

@Injectable()
export class UserService {
  loggedInUser: User;
  users: User[];

  /* Will set back end url depending on environment */
  backEnd = environment.backEndUrl;

  constructor (
    private http: Http
  ){}

  // POST REGISTER
    register( userToRegister: User ) {
      const reqBody = JSON.stringify(userToRegister);
      const jsonHeader = new Headers({ 'Content-Type': 'application/json' });

      return this.http.post( this.backEnd, reqBody, { headers: jsonHeader })
                      .map(
                        ( createdUserRes: Response ) => {
                          createdUserRes.json();
                          console.log(createdUserRes);
                        }
                      )
                      .catch(
                        ( error: Response ) => {

                          return Observable.throw( error.json() );
                        }
                      );
    }

  // POST LOGIN
    login( userToLogin: User ) {
      const reqBody = JSON.stringify( userToLogin );
      const jsonHeader = new Headers({ 'Content-Type': 'application/json' });

      return this.http.post( this.backEnd + '/users/login', reqBody, { headers: jsonHeader })
                      .map(
                        ( signedInUserRes: Response ) => signedInUserRes.json()
                      )
                      .catch(

                        ( dataError: Response ) => {
                          return Observable.throw(dataError.json());
                        }
                      );
    }

  // CHECK LOGIN STATUS
    isLoggedIn() {
      return localStorage.getItem('token') !== null;
    }

  // GET PROFILE
    getProfile() {
      const user = localStorage.getItem('userId') ? localStorage.getItem('userId') : '';

      if ( user !== '' ) {
        return this.http.get( this.backEnd + '/users/' + user )
                        .map(
                          ( userDataRes: Response ) => {
                            const pulledUserData = userDataRes.json();

                            const backToFront = new User(
                              pulledUserData.user.email,
                              pulledUserData.user.password,
                              pulledUserData.user.firstName,
                              pulledUserData.user.lastName,
                              pulledUserData.user.userName,
                              pulledUserData.user._id,
                              pulledUserData.user.services,
                              pulledUserData.user.images,
                              pulledUserData.user.admin,
                              pulledUserData.user.createdAt
                            );

                            this.loggedInUser = backToFront;

                            const backEndMsg = pulledUserData.message;
                            console.log( backEndMsg );

                            return this.loggedInUser;
                          }
                        )
                        .catch(
                          ( dataError: Response ) => {
                            return Observable.throw( dataError.json());
                          }
                        );
      }
    }

  // LOGOUT FUNCTIONALITY
    logOut(){
      localStorage.clear();
    }
}
