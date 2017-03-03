import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZChatEmojiPipe, ZChatEmojiClassPipe } from './emoji.pipe';
import { ZChatEmojiService } from './emoji.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ZChatEmojiPipe,
    ZChatEmojiClassPipe
  ],
  exports: [
    ZChatEmojiPipe,
    ZChatEmojiClassPipe
  ],
  providers: [
    ZChatEmojiService
  ]
})

export class ZChatEmojiModule {
}
