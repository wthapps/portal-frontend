import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { PartialsModule } from '../../core/partials/partials.module';
import { ZChatSettingRoutingModule } from './setting-routing.module';
import { ChatSharedModule } from '../shared/shared.module';
import { ZChatSettingComponent } from './setting.component';
import { SharedModule } from '../../core/shared/shared.module';


@NgModule({
  imports: [
    ReactiveFormsModule,
    ZChatSettingRoutingModule,
    SharedModule.forRoot(),
    ChatSharedModule.forRoot()
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
