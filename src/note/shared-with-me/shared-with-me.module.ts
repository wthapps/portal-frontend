import { NgModule } from '@angular/core';

import { ZNoteSharedModule } from '../shared/shared.module';
import { ZNoteSharedWithMeComponent } from './shared-with-me.component';
import { ZNoteSharedWithMeRoutingModule } from './shared-with-me-routing.module';

@NgModule({
  imports: [ZNoteSharedWithMeRoutingModule, ZNoteSharedModule],
  declarations: [ZNoteSharedWithMeComponent],
  exports: [ZNoteSharedWithMeComponent],
  providers: []
})
export class ZNoteSharedWithMeModule {}
