import { ServiceService } from './services/service.service';
import { ServiceOutletComponent } from './services/outlet/service-outlet.component';
import { UserService } from './auth/user.service';
import { NavBarComponent } from './navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { UserNavComponent } from './auth/user-nav.component';
import { MainRouter } from './app.router';
import { HomeComponent } from './home/home.component';

// REQUIRED
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { FlashMessagesModule } from 'angular2-flash-messages';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UserNavComponent,
    ServiceOutletComponent,
    NavBarComponent
  ],
  imports: [
    BrowserModule,
    MainRouter,
    FormsModule,
    HttpModule,
    FlashMessagesModule
  ],
  providers: [ UserService, ServiceService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
