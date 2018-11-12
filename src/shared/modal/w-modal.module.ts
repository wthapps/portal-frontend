import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BsModalModule } from 'ng2-bs3-modal';

import { WModalService } from './w-modal-service';

@NgModule({
  imports: [
    CommonModule,
    BsModalModule,
  ],
  declarations: [
  ],
  exports: [
  ],
  providers: [
    WModalService
  ],
  entryComponents: [

  ]
})

export class WModalModule {
}
