import { NgModule, ModuleWithProviders } from '@angular/core';
import { CoreSharedModule } from '../../core/shared/shared.module';
import { ZNoteSharedToolBarComponent } from './toolbar/toolbar.component';
import { ZNoteSharedActionBarComponent } from './toolbar/actions-bar.component';
import { ZNoteSharedListComponent } from './list/list.component';
import { ZNoteSharedItemComponent } from './list/item/item.component';
import { ZNoteService } from './services/note.service';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { ZNoteAddFolderModalComponent } from './modals/add-folder/add-folder-modal.component';
import { TagInputModule } from 'ngx-chips';
import { ZNoteSharedModalEditComponent } from './modal/note/edit.component';


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
