import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ZChatSettingRoutingModule } from './setting-routing.module';
import { ZChatSettingComponent } from './setting.component';
import { ZChatSharedModule } from '../shared/shared.module';
import { SharedModule } from '@wth/shared/shared.module';


@NgModule({
  imports: [
    ReactiveFormsModule,
    ZChatSettingRoutingModule,
    ZChatSharedModule.forRoot(),
    SharedModule.forRoot()
  ],
  declarations: [
    ZChatSettingComponent
  ],
  exports: [
    ZChatSettingComponent
  ],
  providers: []
})

export class ZChatSettingModule {
}
