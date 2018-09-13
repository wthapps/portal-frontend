import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ZChatProfileRoutingModule } from './profile-routing.module';
import { ZChatProfileComponent } from './profile.component';
import { ZChatSharedModule } from '../shared/shared.module';
import { SharedModule } from '@wth/shared/shared.module';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ZChatProfileRoutingModule,
    ZChatSharedModule,
    SharedModule,
    // SharedServicesModule.forRoot()
  ],
  declarations: [ZChatProfileComponent],
  exports: [ZChatProfileComponent],
  providers: []
})
export class ZChatProfileModule {}
