import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'service-nav',
  template: `
    <div class="container">
      <router-outlet>SERVICES NAV</router-outlet>
    </div>
  `
})
export class ServiceOutletComponent implements OnInit {

  constructor() {}
  ngOnInit() {}
}
