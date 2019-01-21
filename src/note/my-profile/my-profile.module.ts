import { NgModule } from '@angular/core';

import { ZNoteSharedModule } from '../shared/shared.module';

import { ZNoteMyProfileRoutingModule } from './my-profile-routing.module';

@NgModule({
  imports: [ZNoteMyProfileRoutingModule, ZNoteSharedModule],
  declarations: [],
  exports: [],
  providers: []
})
export class ZNoteMyProfileModule {}
