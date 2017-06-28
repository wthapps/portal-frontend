import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ZChatMyProfileRoutingModule } from './my-profile-routing.module';
import { ChatSharedModule } from '../shared/shared.module';
import { ZChatMyProfileComponent } from './my-profile.component';
import { SharedModule } from '../../core/shared/shared.module';


@NgModule({
  imports: [
    ReactiveFormsModule,
    ZChatMyProfileRoutingModule,
    SharedModule.forRoot(),
    ChatSharedModule.forRoot()
  ],
  declarations: [
    ZChatMyProfileComponent
  ],
  exports: [
    ZChatMyProfileComponent
  ],
  providers: []
})

export class ZChatMyProfileModule {
}
