import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WelcomeRoutingModule } from './welcome-routing.module';
import { WelcomeComponent } from './welcome.component';

@NgModule({
  imports: [
    CommonModule,
    WelcomeRoutingModule
  ],
  declarations: [
    WelcomeComponent
  ],
  exports: [
    WelcomeComponent
  ]
})

export class WelcomeModule {
}
