import { Component, ViewChild} from '@angular/core';
import { ZChatEmojiService } from '../emoji/emoji.service';
import { ChatService } from '../services/chat.service';
import { PostPhotoSelectComponent } from '../../../core/partials/zone/photo/post-upload-photos/post-photo-select.component';

declare var $:any;

@Component({
  moduleId: module.id,
  selector: 'z-chat-share-chatbox',
  templateUrl: 'chat-box.component.html',
  styleUrls: ['chat-box.component.css']
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
    $('#chat-message-text').append(`:${e}`);
    this.placeCaretAtEnd(document.getElementById("chat-message-text"));
  }

  onOpenSelectPhotos() {
    this.photoModal.open();
  }

  chooseDone(e:any) {
    this.photoModal.close();
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
    this.photoModal.close();
    this.chatService.createUploadingFile();
    this.chatService.uploadPhotos(e);
  }

  placeCaretAtEnd(el:any) {
    el.focus();
    if (typeof window.getSelection != "undefined"
      && typeof document.createRange != "undefined") {
      let range:any = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      let sel:any = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }
}
