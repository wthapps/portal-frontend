import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BsModalModule } from 'ng2-bs3-modal';
import { AutoCompleteModule } from 'primeng/components/autocomplete/autocomplete';
import { SharingModalComponent } from './sharing-modal.component';
import { ZMediaSharingService } from './sharing.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BsModalModule,
    AutoCompleteModule
  ],
  declarations: [
    SharingModalComponent
  ],
  exports: [
    SharingModalComponent
  ],
  providers: [
    ZMediaSharingService
  ]
})

export class PartialsPhotoSharingModule {
}
