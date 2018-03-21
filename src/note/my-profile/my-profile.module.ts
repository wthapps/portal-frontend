import { NgModule } from '@angular/core';

import { ZNoteSharedModule } from '../shared/shared.module';

import { ZNoteMyProfileRoutingModule } from './my-profile-routing.module';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  imports: [ZNoteMyProfileRoutingModule, SharedModule, ZNoteSharedModule],
  declarations: [],
  exports: [],
  providers: []
})
export class ZNoteMyProfileModule {}
