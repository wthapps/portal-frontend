import { NgModule, ModuleWithProviders } from '@angular/core';
import { CoreSharedModule } from '../../core/shared/shared.module';
import { ZNoteService } from './services/note.service';
import { ZNoteSharedToolBarComponent } from './toolbar/toolbar.component';
import { ZNoteSharedActionBarComponent } from './toolbar/actions-bar.component';
import { ZNoteSharedListComponent } from './list/list.component';
import { ZNoteSharedItemComponent } from './list/item/item.component';
import { ZNoteSharedModalEditComponent } from './modal/note/edit.component';


/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    CoreSharedModule.forRoot()
  ],
  declarations: [
    ZNoteSharedToolBarComponent,
    ZNoteSharedActionBarComponent,
    ZNoteSharedListComponent,
    ZNoteSharedItemComponent,
    ZNoteSharedModalEditComponent,
  ],
  exports: [
    CoreSharedModule,
    ZNoteSharedToolBarComponent,
    ZNoteSharedActionBarComponent,
    ZNoteSharedListComponent,
    ZNoteSharedItemComponent,
    ZNoteSharedModalEditComponent,
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
