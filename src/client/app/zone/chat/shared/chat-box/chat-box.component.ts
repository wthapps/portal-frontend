import { Component, OnInit, ViewChild} from '@angular/core';
import { ZChatEmojiService } from '../emoji/emoji.service';
import { ChatService } from '../services/chat.service';
import { PostPhotoSelectComponent } from '../../../social/post/post-photo-select.component';

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
  @ViewChild('photoSelectModal') photoModal: PostPhotoSelectComponent;

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.emojiData = ZChatEmojiService.emojis;
    this.photoModal.action = 'UPLOAD';
  }

  send() {
    this.chatService.sendMessage($('#chat-message-text').text());
    $('#chat-message-text').text('');
  }

  onEmojiClick(e:any) {
    console.log(e);
  }

  onOpenSelectPhotos() {
    this.photoModal.open();
  }

  upload(e:any) {
    console.log('aaaaaaaaaaaaaaaaaaaa', e);
  }
  done(e:any) {
    console.log('aaaaaaaaaaaaaaaaaaaa', e);
  }
}
