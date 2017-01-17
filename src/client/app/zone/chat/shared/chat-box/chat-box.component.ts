import { Component, OnInit } from '@angular/core';
import { ZChatEmojiService } from '../emoji/emoji.service';

@Component({
  moduleId: module.id,
  selector: 'z-chat-share-chatbox',
  templateUrl: 'chat-box.component.html',
  styles: [`
    .wth-emoji {cursor:pointer;}
  `]
})

export class ZChatChatboxComponent implements OnInit {

  emojiData: any = [];

  ngOnInit() {
    this.emojiData = ZChatEmojiService.emojis;
  }

  onEmojiClick(e) {
    console.log(e);
  }
}
