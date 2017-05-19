import { Component, ViewChild, HostListener, OnInit, HostBinding, OnDestroy, ElementRef } from '@angular/core';
import { ZChatEmojiService } from '../emoji/emoji.service';
import { ChatService } from '../services/chat.service';
import { PostPhotoSelectComponent } from '../../../core/partials/zone/photo/post-upload-photos/post-photo-select.component';
import { PhotoModalDataService } from '../../../core/shared/services/photo-modal-data.service';
import { Subscription } from 'rxjs';
import { ZChatChatboxService } from './chat-box.service';

declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'z-chat-share-chatbox',
  templateUrl: 'chat-box.component.html',
  styleUrls: ['chat-box.component.css']
})

export class ZChatChatboxComponent implements OnInit, OnDestroy {
  emojiData: any = [];

  // Subscription list
  nextPhotoSubscription: Subscription;
  uploadPhotoSubscription: Subscription;

  quoteSubscription: Subscription;
  quoteMess: any = [];

  constructor(private chatService: ChatService,
              private photoSelectDataService: PhotoModalDataService,
              private chatboxService: ZChatChatboxService) {
  }

  ngOnInit() {
    this.emojiData = ZChatEmojiService.emojis;
    // this.photoModal.action = 'UPLOAD';

    this.quoteSubscription = this.chatboxService.listeningFromItem$.subscribe((mess: any) => {
      this.quoteMess.length = 0;
      this.quoteMess.push(mess);
    });
  }

  ngOnDestroy() {
    this.unsubscribePhotoEvents();
    this.quoteSubscription.unsubscribe();
  }

  send() {
    this.chatService.sendTextMessage($('#chat-message-text').html());
    $('#chat-message-text').html('');
    this.quoteMess.length = 0;
  }

  onEmojiClick(e: any) {
    $('#chat-message-text').append(`${e.replace(/\\/gi, '')}`);
    this.placeCaretAtEnd(document.getElementById('chat-message-text'));
  }

  onOpenSelectPhotos() {
    // this.photoModal.open();
    this.photoSelectDataService.open('');

    this.subscribePhotoEvents();
  }

  chooseDone(e: any) {
    // this.photoModal.close();
    for (let photo of e) {
      this.chatService.uploadPhotoOnWeb(photo);
    }
  }

  uploadFile(e: any) {
    let files = e.target.files;
    // Create a file uploading
    this.chatService.createUploadingFile();
    this.chatService.uploadFiles(files);
  }

  uploadPhoto(e: any) {
    // this.photoModal.close();
    this.chatService.createUploadingFile();
    this.chatService.uploadPhotos(e);
  }

  placeCaretAtEnd(el: any) {
    el.focus();
    if (typeof window.getSelection != 'undefined'
      && typeof document.createRange != 'undefined') {
      let range: any = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      let sel: any = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }

  private subscribePhotoEvents() {

    let closeObs$ = this.photoSelectDataService.dismissObs$.merge(this.photoSelectDataService.closeObs$);
    // Subscribe actions corresponding with photo modal actions

    if (this.notAssignedSubscription(this.nextPhotoSubscription)) {
      this.nextPhotoSubscription = this.photoSelectDataService.nextObs$.takeUntil(closeObs$).subscribe(
        (photos: any) => {
          this.chooseDone(photos);
          // this.uploadPhoto(photos);
        },
        (error: any) => {
          console.error(error);
        }
      );
    }

    if (this.notAssignedSubscription(this.uploadPhotoSubscription)) {
      this.uploadPhotoSubscription = this.photoSelectDataService.uploadObs$.takeUntil(closeObs$).subscribe(
        (photos: any) => {
          this.uploadPhoto(photos);
        },
        (error: any) => {
          console.error(error);
        }
      );
    }
  }

  private notAssignedSubscription(sub: Subscription) {
    return !sub || sub.closed;
  }

  private unsubscribePhotoEvents() {
    [this.nextPhotoSubscription, this.uploadPhotoSubscription].forEach((sub: Subscription) => {
      if (sub && !sub.closed)
        sub.unsubscribe();
    });
  }
}
