// REQUIRED
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'user-nav',
  template: `
    <router-outlet></router-outlet>
  `
})
export class UserNavComponent implements OnInit {

  constructor() {}
  ngOnInit () {}
}
