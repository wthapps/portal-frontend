import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZChatEmojiPipe } from './emoji.pipe';
import { ZChatEmojiService } from './emoji.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ZChatEmojiPipe
  ],
  exports: [
    ZChatEmojiPipe
  ],
  providers: [
    ZChatEmojiService
  ]
})

export class ZChatEmojiModule {
}
