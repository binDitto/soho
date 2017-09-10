import { UserService } from '../user.service';
import { User } from '../user.model';
// REQUIRED
import { Component, OnInit, Input, Output } from '@angular/core';

@Component({
  selector: 'profile-page',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class UserProfileComponent implements OnInit {

  @Input() userProfile: User;

  constructor( private userservice: UserService) {
    this.userProfile = <User>{};
  }

  ngOnInit() {
    this.userservice.getProfile().subscribe(
      ( loggedInUser ) => {
        this.userProfile = loggedInUser;
        console.log( this.userProfile.userName + ' is now logged in!' );
      },
      (dataError) => {
        console.error( dataError );
        return false;
      }
    );
  }


}
