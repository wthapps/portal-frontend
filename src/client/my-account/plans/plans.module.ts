import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { PartialsModule } from '../../core/partials/partials.module';
import { ACPlansService } from './plans.service';
import { ACPlansRoutingModule } from './plans-routing.module';
import { ACPlansComponent } from './plans.component';


@NgModule({
  imports: [
    CommonModule,
    ACPlansRoutingModule,
    PartialsModule,
    ReactiveFormsModule
  ],
  declarations: [
    ACPlansComponent
  ],
  exports: [
    ACPlansComponent
  ],
  providers: [ACPlansService]
})

export class ACPlansModule {
}
