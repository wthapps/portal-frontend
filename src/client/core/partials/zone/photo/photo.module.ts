import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PostPhotoSelectComponent } from './post-upload-photos/post-photo-select.component';
import { SoPhotoListComponent } from './photo-list/photo-list.component';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { FileSelectionComponent } from './file-select/file-selection.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    Ng2Bs3ModalModule

  ],
  declarations: [PostPhotoSelectComponent, SoPhotoListComponent, FileSelectionComponent],
  exports: [PostPhotoSelectComponent, SoPhotoListComponent, FileSelectionComponent],
  providers: []
})

export class PhotoModule {
}
