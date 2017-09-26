import { NgModule, ModuleWithProviders } from '@angular/core';
import { CoreSharedModule } from '../../core/shared/shared.module';
import { ZNoteSharedToolBarComponent } from './toolbar/toolbar.component';
import { ZNoteSharedActionBarComponent } from './toolbar/actions-bar.component';
import { ZNoteSharedListComponent } from './list/list.component';
import { ZNoteSharedItemComponent } from './list/item/item.component';
import { ZNoteService } from './services/note.service';
import { ZNoteAddFolderModalComponent } from './modal/add-folder/add-folder-modal.component';
import { ZNoteSharedModalEditComponent } from './modal/note/edit.component';
import { ZNoteSharedModalViewComponent } from './modal/note/view.component';

import { QuillModule } from 'ngx-quill';
import { TagInputModule } from 'ngx-chips';


/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    QuillModule,
    TagInputModule,
    CoreSharedModule.forRoot()
  ],
  declarations: [
    ZNoteSharedToolBarComponent,
    ZNoteSharedActionBarComponent,
    ZNoteSharedListComponent,
    ZNoteSharedItemComponent,
    ZNoteSharedModalEditComponent,
    ZNoteSharedModalViewComponent,
    ZNoteAddFolderModalComponent
  ],
  exports: [
    CoreSharedModule,
    ZNoteSharedToolBarComponent,
    ZNoteSharedActionBarComponent,
    ZNoteSharedListComponent,
    ZNoteSharedItemComponent,
    ZNoteSharedModalEditComponent,
    ZNoteSharedModalViewComponent,
    ZNoteAddFolderModalComponent
  ]
})
export class ZNoteSharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ZNoteSharedModule,
      providers: [
        ZNoteService
      ]
    };
  }
}
