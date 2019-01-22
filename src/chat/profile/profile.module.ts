import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ZChatProfileRoutingModule } from './profile-routing.module';
import { ZChatProfileComponent } from './profile.component';
import { ZChatSharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';
import { PartialsProfileModule } from '@shared/shared/components/profile/profile.module';

@NgModule({
  imports: [
    CommonModule,
    PartialsProfileModule,
    ReactiveFormsModule,
    ZChatProfileRoutingModule,
    ZChatSharedModule
  ],
  declarations: [ZChatProfileComponent],
  exports: [ZChatProfileComponent],
  providers: []
})
export class ZChatProfileModule {}
