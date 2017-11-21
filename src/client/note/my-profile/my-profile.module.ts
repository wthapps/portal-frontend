import { NgModule } from '@angular/core';

import { ZNoteSharedModule } from '../shared/shared.module';

import { ZNoteMyProfileComponent } from './my-profile.component';
import { ZNoteMyProfileRoutingModule } from './my-profile-routing.module';
import { CoreSharedModule } from '../../core/shared/shared.module';


@NgModule({
  imports: [
    ZNoteMyProfileRoutingModule,
    CoreSharedModule.forRoot(),
    ZNoteSharedModule.forRoot()
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
