import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ZChatSharedModule } from '../shared/shared.module';
import { ZChatMyProfileRoutingModule } from './my-profile-routing.module';
import { SharedModule } from '@wth/shared/shared.module';


@NgModule({
  imports: [
    ReactiveFormsModule,
    ZChatMyProfileRoutingModule,
    ZChatSharedModule.forRoot(),
    SharedModule.forRoot()
  ],
  declarations: [
  ],
  exports: [
  ],
  providers: []
})

export class ZChatMyProfileModule {
}
