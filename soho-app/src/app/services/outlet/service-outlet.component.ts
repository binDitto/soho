import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'service-nav',
  template: `
    <div class="container">
      <h4>Router Pages</h4>
      <router-outlet></router-outlet>
    </div>
  `
})
export class ServiceOutletComponent implements OnInit {

  constructor() {}
  ngOnInit() {}
}
