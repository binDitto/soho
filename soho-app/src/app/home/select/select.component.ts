import { Service } from '../../services/service.model';
import { ServiceService } from '../../services/service.service';

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'soho-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css']
})
export class SohoSelectComponent implements OnInit {

  public services: Service[] = [];

  constructor( private servprovider: ServiceService ) { }

  ngOnInit() {
    this.servprovider.getServices().subscribe(
      (services: Service[]) => {
        for ( let i = 0; this.services.length <= 5 ; i ++){
          console.log(services[i]);

          this.services.push(services[i]);
        }
      }
    );
  }
}
