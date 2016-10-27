import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';

import { GrowlModule } from 'primeng/primeng';

import { ToastsComponent } from './toast-message.component';
import { ToastsService } from './toast-message.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    GrowlModule
  ],
  declarations: [ToastsComponent],
  exports: [ToastsComponent],
  providers: [ToastsService]
})

export class ToastsModule {
}
