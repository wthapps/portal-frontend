import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ZChatSharedModule } from '../shared/shared.module';
import { ModalModule } from '@wth/shared/modals/modals.module';
import { ZChatMessageModule } from '@chat/shared/message/message.module';

@NgModule({
  imports: [
    ReactiveFormsModule,
    ModalModule,
    ZChatMessageModule,
    ZChatSharedModule
  ],
  declarations: [
  ],
  exports: [
    ZChatMessageModule,

  ],
  providers: [
  ]
})
export class ChatContainerModule {}
