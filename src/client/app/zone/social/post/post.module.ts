import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HdModalModule } from "../../shared/ng2-hd/modal/hd-modal";
import { FileSelectionComponent } from "./file-selection.component";
import { SoPhotoSelectionComponent } from "./photo-selection.component";
import { SoPhotoListComponent } from "./index";


@NgModule({
  imports: [
    CommonModule,
    HdModalModule
  ],
  declarations: [
    SoPhotoSelectionComponent,
    FileSelectionComponent,
    SoPhotoListComponent
  ],
  exports: [
    SoPhotoSelectionComponent,
    FileSelectionComponent,
    SoPhotoListComponent
  ]
})

export class PostModule {
}
