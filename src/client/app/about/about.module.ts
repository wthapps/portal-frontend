import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutComponent } from './about.component';
import { AboutRoutingModule } from './about-routing.module';
import { PartialsModule } from '../partials/partials.module';

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
