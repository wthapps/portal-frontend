import { Component, OnInit, ViewChild} from '@angular/core';
import { ZChatEmojiService } from '../emoji/emoji.service';
import { ChatService } from '../services/chat.service';

declare var $:any;

@Component({
  moduleId: module.id,
  selector: 'z-chat-share-chatbox',
  templateUrl: 'chat-box.component.html',
  styleUrls: ['chat-box.component.css']
})

export class ZChatChatboxComponent {
  emojiData: any = [];
  // @ViewChild('photoSelectModal') photoModal: PostPhotoSelectComponent;

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.emojiData = ZChatEmojiService.emojis;
    // this.photoModal.action = 'UPLOAD';
  }

  send() {
    this.chatService.sendMessage($('#chat-message-text').text());
    $('#chat-message-text').text('');
  }

  onEmojiClick(e:any) {
    $('#chat-message-text').append('<i class="wth-emoji wth-emoji-(" title=":(:"></i>')
  }

  onOpenSelectPhotos() {
    // this.photoModal.open();
  }

  chooseDone(e:any) {
    // this.photoModal.close();
    for (let photo of e) {
      photo.type = 'Photo';
      this.chatService.sendMessage('', photo);
    }
  }

  uploadFile(e:any) {
    let files = e.target.files;
    // Create a file uploading
    this.chatService.createUploadingFile();
    this.chatService.uploadFiles(files);
  }

  uploadPhoto(e:any) {
    this.chatService.createUploadingFile();
    this.chatService.uploadPhotos(e);
    // this.photoModal.close();
  }
}
