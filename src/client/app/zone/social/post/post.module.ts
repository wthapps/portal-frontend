import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HdModalModule } from "../../shared/ng2-hd/modal/hd-modal";
import { FileSelectionComponent } from "./file-selection.component";
import { PostNewComponent } from "./post-new.component";
import { SoPhotoListComponent, PostEditComponent, PostPhotoSelectComponent } from "./index";


@NgModule({
  imports: [
    CommonModule,
    HdModalModule
  ],
  declarations: [
    PostNewComponent,
    FileSelectionComponent,
    SoPhotoListComponent,
    PostEditComponent,
    PostPhotoSelectComponent
  ],
  exports: [
    PostNewComponent,
    FileSelectionComponent,
    SoPhotoListComponent,
    PostEditComponent,
    PostPhotoSelectComponent
  ]
})

export class PostModule {
}
