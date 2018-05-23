import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ZChatSharedModule } from '../shared/shared.module';
import { ZChatMyProfileRoutingModule } from './my-profile-routing.module';
import { SharedModule } from '@wth/shared/shared.module';
import { ZChatMyProfileComponent } from '@chat/my-profile/my-profile.component';
import { SharedServicesModule } from '@wth/shared/shared-services.module';

@NgModule({
  imports: [
    ReactiveFormsModule,
    ZChatMyProfileRoutingModule,
    ZChatSharedModule.forRoot(),
    SharedModule.forRoot(),
    SharedServicesModule.forRoot()
  ],
  declarations: [ZChatMyProfileComponent],
  exports: [ZChatMyProfileComponent],
  providers: []
})
export class ZChatMyProfileModule {}
