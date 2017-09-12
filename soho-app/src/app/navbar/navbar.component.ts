import { UserService } from '../auth/user.service';
//  REQUIRED
import { Component, OnInit, Input, Output } from '@angular/core';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'soho-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']

})
export class NavBarComponent implements OnInit {

  @Input() userFirstName: String;

  constructor ( private userservice: UserService, private router: Router){
    this.userFirstName = '';
  }
  ngOnInit (){
    if( localStorage.getItem('userId') !== null ) {
      this.userservice.getProfile().subscribe(
        profile => this.userFirstName = profile.firstName
      );
    }
  }

  isLoggedIn(){
    return this.userservice.isLoggedIn();
  }

  logOutUser(){
    this.userservice.logOut();
    this.router.navigate(['/users', 'login']);
  }
}
