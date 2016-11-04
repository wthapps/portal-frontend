import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HdModalModule } from '../../shared/ng2-hd/modal/hd-modal';

import {
  SoPhotoListComponent,
  FileSelectionComponent,
  PostEditComponent,
  PostPhotoSelectComponent,
  PostNewComponent
} from './index';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HdModalModule
  ],
  declarations: [
    PostNewComponent,
    FileSelectionComponent,
    SoPhotoListComponent,
    PostEditComponent,
    PostNewComponent,
    PostPhotoSelectComponent
  ],
  exports: [
    CommonModule,
    PostNewComponent,
    FileSelectionComponent,
    SoPhotoListComponent,
    PostEditComponent,
    PostNewComponent,
    PostPhotoSelectComponent
  ]
})

export class PostModule {
}
