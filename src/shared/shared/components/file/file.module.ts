import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FileSelectComponent } from './file-select/file-select.component';
import { BsModalModule } from 'ng2-bs3-modal';
import { FileBrowseComponent } from './file-browse/file-browse.component';
import { FileSelectListComponent } from './file-select-list/file-select-list.component';
import { UploadCropImageModule } from '../upload-crop-image/upload-crop-image.module';
import { FileSelectCropComponent } from './file-select-crop/file-select-crop.component';
import { CropImageComponent } from './file-crop/crop-image.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    BsModalModule
  ],
  declarations: [FileSelectComponent, FileSelectListComponent, FileBrowseComponent, FileSelectCropComponent, CropImageComponent],
  exports: [FileSelectComponent, FileSelectListComponent, FileBrowseComponent, FileSelectCropComponent, CropImageComponent],
  providers: []
})

export class FileModule {
}
