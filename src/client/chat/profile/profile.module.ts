import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ZChatProfileRoutingModule } from './profile-routing.module';
import { ChatSharedModule } from '../shared/shared.module';
import { ZChatProfileComponent } from './profile.component';
import { SharedModule } from '../../core/shared/shared.module';


@NgModule({
  imports: [
    ReactiveFormsModule,
    ZChatProfileRoutingModule,
    SharedModule.forRoot(),
    ChatSharedModule.forRoot()
  ],
  declarations: [
    ZChatProfileComponent
  ],
  exports: [
    ZChatProfileComponent
  ],
  providers: []
})

export class ZChatProfileModule {
}
