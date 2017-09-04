// REQUIRED
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'user-nav',
  template: `
    <div class="container">
      <h3>Will display User pages</h3>
      <router-outlet></router-outlet>
    </div>
  `
})
export class UserNavComponent implements OnInit {

  constructor() {}
  ngOnInit () {}
}
