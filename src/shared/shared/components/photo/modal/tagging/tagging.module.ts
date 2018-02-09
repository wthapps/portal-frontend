import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TagInputModule } from 'ngx-chips';

import { BsModalModule } from 'ng2-bs3-modal';
import { TaggingModalComponent } from './tagging-modal.component';
import { TaggingElComponent } from './tagging-el.component';
import { ZMediaTaggingService } from './tagging.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    BsModalModule,

    TagInputModule,
    // BrowserAnimationsModule
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
