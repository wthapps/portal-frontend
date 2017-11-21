import { NgModule } from '@angular/core';

import { ZNoteSharedModule } from '../shared/shared.module';
import { ZNoteTrashRoutingModule } from './trash-routing.module';
import { ZNoteTrashComponent } from './trash.component';


@NgModule({
  imports: [
    ZNoteTrashRoutingModule,
    ZNoteSharedModule.forRoot()
  ],
  declarations: [
    ZNoteTrashComponent
  ],
  exports: [
    ZNoteTrashComponent
  ],
  providers: []
})

export class ZNoteTrashModule {
}
