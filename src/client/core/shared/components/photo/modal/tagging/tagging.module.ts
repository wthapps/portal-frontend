import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TagInputModule } from 'ngx-chips';

import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { TaggingModalComponent } from './tagging-modal.component';
import { TaggingElComponent } from './tagging-el.component';
import { ZMediaTaggingService } from './tagging.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    Ng2Bs3ModalModule,

    TagInputModule,
    BrowserAnimationsModule
  ],
  declarations: [
    TaggingModalComponent,
    TaggingElComponent
  ],
  exports: [
    TaggingModalComponent,
    TaggingElComponent
  ],
  providers: [
    ZMediaTaggingService
  ]
})

export class PartialsPhotoTaggingModule {
}
