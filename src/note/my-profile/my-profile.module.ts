import { NgModule } from '@angular/core';

import { ZNoteSharedModule } from '../shared/shared.module';

import { ZNoteMyProfileRoutingModule } from './my-profile-routing.module';
import { PartialsProfileModule } from '@shared/shared/components/profile/profile.module';

@NgModule({
  imports: [
    ZNoteMyProfileRoutingModule,
    PartialsProfileModule,
    ZNoteSharedModule
  ],
  declarations: [],
  exports: [],
  providers: []
})
export class ZNoteMyProfileModule {}
