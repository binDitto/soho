import { Component } from '@angular/core';

// IMPORT ENVIRONMENT
  /* IMPORTANT -- will automatically set to either environment.ts or environment.prod.ts depending on
    whether its on server or local. Make sure if you upload to heroku, ng build -prod beforehand. */
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  environment = environment.envName === "Development" ? environment.envName : '';


}
