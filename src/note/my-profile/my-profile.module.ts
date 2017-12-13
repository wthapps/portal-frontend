import { NgModule } from '@angular/core';

import { ZNoteSharedModule } from '../shared/shared.module';

import { ZNoteMyProfileComponent } from './my-profile.component';
import { ZNoteMyProfileRoutingModule } from './my-profile-routing.module';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  imports: [
    ZNoteMyProfileRoutingModule,
    SharedModule,
    ZNoteSharedModule
  ],
  declarations: [
    ZNoteMyProfileComponent
  ],
  exports: [
    ZNoteMyProfileComponent
  ],
  providers: []
})

export class ZNoteMyProfileModule {
}
