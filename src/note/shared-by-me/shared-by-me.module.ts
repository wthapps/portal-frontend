import { NgModule } from '@angular/core';

import { ZNoteSharedModule } from '../shared/shared.module';
import { ZNoteSharedByMeRoutingModule } from "note/shared-by-me/shared-by-me-routing.module";
import { ZNoteSharedByMeComponent } from "note/shared-by-me/shared-by-me.component";

@NgModule({
  imports: [
    ZNoteSharedByMeRoutingModule,
    ZNoteSharedModule
  ],
  declarations: [
    ZNoteSharedByMeComponent
  ],
  exports: [
    ZNoteSharedByMeComponent
  ],
  providers: []
})

export class ZNoteSharedByMeModule {
}
