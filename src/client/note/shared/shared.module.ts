import { NgModule, ModuleWithProviders } from '@angular/core';
import { TagInputModule } from 'ngx-chips';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';

import { CoreSharedModule } from '../../core/shared/shared.module';
import { ZNoteSharedToolBarComponent } from './toolbar/toolbar.component';
import { ZNoteSharedActionBarComponent } from './toolbar/actions-bar.component';
import { ZNoteSharedListComponent } from './list/list.component';
import { ZNoteSharedItemComponent } from './list/item/item.component';
import { ZNoteService } from './services/note.service';
import { ZNoteAddFolderModalComponent } from './modals/add-folder/add-folder-modal.component';
import { ZNoteSharedModalEditComponent } from './modal/note/edit.component';
import { ZNoteSharedModalViewComponent } from './modal/note/view.component';


/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
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
    FroalaEditorModule,
    FroalaViewModule,
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
