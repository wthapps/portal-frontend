import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TagInputModule } from 'ng2-tag-input/dist/modules';
// import { TagInputModule } from 'ng2-tag-input';

import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { TaggingModalComponent } from './tagging-modal.component';
import { TaggingElComponent } from './tagging-el.component';
import { ZMediaTaggingService } from './tagging.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    Ng2Bs3ModalModule,
    TagInputModule
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
