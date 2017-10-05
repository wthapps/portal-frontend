import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FileSelectComponent } from './file-select/file-select.component';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { FileBrowseComponent } from './file-browse/file-browse.component';
import { FileSelectListComponent } from './file-select-list/file-select-list.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    Ng2Bs3ModalModule
  ],
  declarations: [FileSelectComponent, FileSelectListComponent, FileBrowseComponent],
  exports: [FileSelectComponent, FileSelectListComponent, FileBrowseComponent],
  providers: []
})

export class FileModule {
}
