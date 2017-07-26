import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ZChatSettingRoutingModule } from './setting-routing.module';
import { ZChatSettingComponent } from './setting.component';
import { ZChatSharedModule } from '../shared/shared.module';
import { CoreSharedModule } from '../../core/shared/shared.module';


@NgModule({
  imports: [
    ReactiveFormsModule,
    ZChatSettingRoutingModule,
    ZChatSharedModule.forRoot(),
    CoreSharedModule.forRoot()
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
