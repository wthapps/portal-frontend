import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ZChatSharedModule } from '../shared/shared.module';
import { ModalModule } from '@wth/shared/modals/modals.module';

@NgModule({
  imports: [
    ReactiveFormsModule,
    ModalModule,

    ZChatSharedModule
  ],
  declarations: [
  ],
  exports: [

  ],
  providers: [
  ]
})
export class ChatContainerModule {}
