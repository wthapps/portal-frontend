import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GrowlModule } from 'primeng/components/growl/growl';

import { ToastsComponent } from './toast-message.component';
import { ToastModule } from 'primeng/toast';

@NgModule({
  imports: [CommonModule, ToastModule, GrowlModule],
  declarations: [ToastsComponent],
  exports: [ToastModule, ToastsComponent],
  providers: []
})
export class ToastsModule {}
