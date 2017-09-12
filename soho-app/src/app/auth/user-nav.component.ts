// REQUIRED
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'user-nav',
  template: `
    <div class="container">
      <router-outlet>User Routes</router-outlet>
    </div>
  `
})
export class UserNavComponent implements OnInit {

  constructor() {}
  ngOnInit () {}
}
