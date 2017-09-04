import { FormsModule } from '@angular/forms';
import { UserNavComponent } from './auth/user-nav.component';
import { MainRouter } from './app.router';
import { HomeComponent } from './home/home.component';

// REQUIRED
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UserNavComponent
  ],
  imports: [
    BrowserModule,
    MainRouter,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
