import { NgModule } from '@angular/core';
import { ShortMessagePipe } from '@shared/chat/pipe/short-message.pipe';

@NgModule({
  imports: [
  ],
  declarations: [
    ShortMessagePipe,
  ],
  exports: [
    ShortMessagePipe,
  ]
})
export class ChatPipeModule {}
