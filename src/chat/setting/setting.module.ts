import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ZChatSettingRoutingModule } from './setting-routing.module';
import { ZChatSettingComponent } from './setting.component';
import { ZChatSharedModule } from '../shared/shared.module';

@NgModule({
  imports: [ReactiveFormsModule, ZChatSettingRoutingModule, ZChatSharedModule],
  declarations: [ZChatSettingComponent],
  exports: [ZChatSettingComponent],
  providers: []
})
export class ZChatSettingModule {}
