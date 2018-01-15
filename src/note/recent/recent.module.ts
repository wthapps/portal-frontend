import { NgModule } from '@angular/core';

import { ZNoteSharedModule } from '../shared/shared.module';
import { ZNoteRecentComponent } from './recent.component';
import { ZNoteRecentRoutingModule } from './recent-routing.module';

@NgModule({
  imports: [
    ZNoteRecentRoutingModule,
    ZNoteSharedModule
  ],
  declarations: [
    ZNoteRecentComponent
  ],
  exports: [
    ZNoteRecentComponent
  ],
  providers: []
})

export class ZNoteRecentModule {
}
