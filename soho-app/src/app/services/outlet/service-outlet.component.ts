import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'service-nav',
  template: `
      <router-outlet></router-outlet>
  `
})
export class ServiceOutletComponent implements OnInit {

  constructor() {}
  ngOnInit() {}
}
