import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GrowlModule } from 'primeng/components/growl/growl';

import { ToastsComponent } from './toast-message.component';
// import { ToastsService } from './toast-message.service';
// import { MessageService } from 'primeng/components/common/messageservice';

@NgModule({
  imports: [
    CommonModule,
    GrowlModule
  ],
  declarations: [ToastsComponent],
  exports: [ToastsComponent],
  providers: [
  ]
})

export class ToastsModule {
}
