import { UserService } from '../user.service';
import { User } from '../user.model';
// REQUIRED
import { Component, OnInit, Input, Output } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'profile-page',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class UserProfileComponent implements OnInit {

  @Input() profile: User;

  constructor( private userservice: UserService, private flash: FlashMessagesService ) {}

  ngOnInit() {
    this.userservice.getProfile().subscribe(
      loggedInUser => {
        this.profile = loggedInUser
      });
  }


}
