import { NgModule } from '@angular/core';

import { ZNoteSharedModule } from '../shared/shared.module';
import { ZNoteSearchComponent } from './search.component';
import { ZNoteSearchRoutingModule } from './search-routing.module';


@NgModule({
  imports: [
    ZNoteSearchRoutingModule,
    ZNoteSharedModule
  ],
  declarations: [
    ZNoteSearchComponent
  ],
  exports: [
    ZNoteSearchComponent
  ],
  providers: []
})

export class ZNoteSearchModule {
}
