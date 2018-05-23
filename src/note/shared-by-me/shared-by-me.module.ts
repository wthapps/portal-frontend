import { NgModule } from '@angular/core';

import { ZNoteSharedModule } from '../shared/shared.module';
import { ZNoteSharedByMeRoutingModule } from '@notes/shared-by-me/shared-by-me-routing.module';
import { ZNoteSharedByMeComponent } from '@notes/shared-by-me/shared-by-me.component';

@NgModule({
  imports: [ZNoteSharedByMeRoutingModule, ZNoteSharedModule],
  declarations: [ZNoteSharedByMeComponent],
  exports: [ZNoteSharedByMeComponent],
  providers: []
})
export class ZNoteSharedByMeModule {}
