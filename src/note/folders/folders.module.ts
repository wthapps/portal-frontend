import { NgModule } from '@angular/core';

import { ZNoteSharedModule } from '../shared/shared.module';
import { ZNoteFoldersComponent } from './folders.component';
import { ZNoteFoldersRoutingModule } from './folders-routing.module';


@NgModule({
  imports: [
    ZNoteFoldersRoutingModule,
    ZNoteSharedModule,
  ],
  declarations: [
    ZNoteFoldersComponent
  ],
  exports: [
    ZNoteFoldersComponent
  ],
  providers: []
})

export class ZNoteFoldersModule {
}
