import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PartialsModule } from '../../core/partials/partials.module';

import { AboutComponent } from './about.component';
import { AboutRoutingModule } from './about-routing.module';

@NgModule({
  imports: [
    CommonModule,
    AboutRoutingModule,
    PartialsModule
  ],
  declarations: [
    AboutComponent
  ],
  exports: [
    AboutComponent
  ]
})
export class AboutModule {
}
