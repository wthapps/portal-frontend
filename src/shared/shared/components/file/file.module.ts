import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BsModalModule } from 'ng2-bs3-modal';
import { FileBrowseComponent } from './file-browse/file-browse.component';
import { FileSelectListComponent } from './file-select-list/file-select-list.component';
import { FileSelectCropComponent } from './file-select-crop/file-select-crop.component';
import { CropImageComponent } from './file-crop/crop-image.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    BsModalModule
  ],
  declarations: [FileSelectListComponent, FileBrowseComponent, FileSelectCropComponent, CropImageComponent],
  exports: [FileSelectListComponent, FileBrowseComponent, FileSelectCropComponent, CropImageComponent],
  providers: []
})

export class FileModule {
}
