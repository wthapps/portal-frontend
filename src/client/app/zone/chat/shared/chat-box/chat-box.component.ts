import { Component, OnInit } from '@angular/core';
import { ZChatEmojiService } from '../emoji/emoji.service';
import { ChatService } from '../services/chat.service';

declare var $:any;

@Component({
  moduleId: module.id,
  selector: 'z-chat-share-chatbox',
  templateUrl: 'chat-box.component.html',
  styles: [`
    .wth-emoji {cursor:pointer;}
  `]
})

export class ZChatChatboxComponent {
  emojiData: any = [];

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.emojiData = ZChatEmojiService.emojis;
  }

  send() {
    this.chatService.sendMessage($('#chat-message-text').text());
    $('#chat-message-text').text('');
  }

  onEmojiClick(e:any) {
    console.log(e);
  }
}
