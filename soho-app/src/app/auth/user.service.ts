import { Injectable, EventEmitter, Output } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { tokenNotExpired } from 'angular2-jwt';
import { Observable } from 'rxjs';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';
import { User } from './user.model';

@Injectable()
export class UserService {
  usertoken: any;
  user: any;
  loggedInUser: User;
  users: User[];
  backEnd = environment.backEndUrl;

  constructor ( private http: Http ){}

    register( userToRegister: User ) {
      let headers = new Headers();
          headers.append('Content-Type', 'application/json');

      return this.http.post( this.backEnd + 'users', userToRegister, { headers: headers })
                      .map( createdUserRes  => createdUserRes.json() )
                      .catch( error => Observable.throw( error.json() ) );
    }

    login( userToLogin ) {
      let headers = new Headers();
          headers.append('Content-Type', 'application/json');

      const userbody = JSON.stringify(userToLogin);

      return this.http.post( this.backEnd + 'users/login', userToLogin, { headers: headers })
                      .map( signedInUserRes  => signedInUserRes.json() )
                      .catch( dataError => Observable.throw( dataError.json() ) );
    }

            isLoggedIn() {
              return localStorage.getItem('token') !== null && tokenNotExpired('token') !== false;
            }

            storeUserData( token, user ) {
              localStorage.setItem('token', token);
              localStorage.setItem('user', JSON.stringify( user ));
              localStorage.setItem('userId', user.id);
              this.usertoken = token;
              this.user = user;
            }

            loadToken() {
              const token = localStorage.getItem('token') ? localStorage.getItem('token') : '';
              const user = localStorage.getItem('user') ? localStorage.getItem('user') : '';
              this.usertoken = token;
              this.user = user;
            }

    getProfile() {

      let headers = new Headers();
          headers.append('Content-Type', 'application/json');

      let user = localStorage.getItem('userId') ? localStorage.getItem('userId') : '';

      if ( user !== '' ) {
        return this.http.get( this.backEnd + 'users/' + user, { headers: headers } )
                        .map( userDataRes => {
                            const pulledUserData = userDataRes.json();

                            const backToFront = new User(
                              pulledUserData.user.email,
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

                            console.log('Success: ' + pulledUserData.success + ', Message: ' + pulledUserData.msg);

                            return this.loggedInUser;
                          }
                        )
                        .catch( dataError  => Observable.throw( dataError.json() ) );
      }
    }

    logOut(){
      localStorage.clear();
    }
}
