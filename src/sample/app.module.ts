import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SampleMediaModule } from './media/media.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SampleMediaModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
