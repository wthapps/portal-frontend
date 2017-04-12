import { Component, ViewChild, HostListener, OnInit, HostBinding, OnDestroy } from '@angular/core';
import { ZChatEmojiService } from '../emoji/emoji.service';
import { ChatService } from '../services/chat.service';
import { PostPhotoSelectComponent } from '../../../core/partials/zone/photo/post-upload-photos/post-photo-select.component';
import { PhotoModalDataService } from '../../../core/shared/services/photo-modal-data.service';
import { Subscription } from 'rxjs';

declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'z-chat-share-chatbox',
  templateUrl: 'chat-box.component.html',
  styleUrls: ['chat-box.component.css']
})

export class ZChatChatboxComponent implements OnInit, OnDestroy {
  // @ViewChild('photoSelectModal') photoModal: PostPhotoSelectComponent;
  @HostBinding('class') keyCtrlClass = '';

  emojiData: any = [];

  // Subscription list
  nextPhotoSubscription: Subscription;
  uploadPhotoSubscription: Subscription;

  constructor(private chatService: ChatService,
              private photoSelectDataService: PhotoModalDataService
  ) {
  }

  ngOnInit() {
    this.emojiData = ZChatEmojiService.emojis;
    // this.photoModal.action = 'UPLOAD';
  }

  ngOnDestroy() {
    this.unsubscribePhotoEvents();
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(ev: KeyboardEvent) {
    // console.log(ev);
    if (ev.keyCode == 16) {
      this.keyCtrlClass = 'active';
    }
  }

  @HostListener('document:keyup', ['$event'])
  onKeyUp(ev: KeyboardEvent) {
    if (ev.keyCode == 16) {
      this.keyCtrlClass = 'active';
    }
  }

  send() {
    this.chatService.sendTextMessage($('#chat-message-text').text());
    $('#chat-message-text').text('');
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

    if(this.notAssignedSubscription(this.nextPhotoSubscription)) {
      this.nextPhotoSubscription = this.photoSelectDataService.nextObs$.takeUntil(closeObs$).subscribe(
        (photos: any) => {
          this.chooseDone(photos);
          // this.uploadPhoto(photos);
        },
        (error : any) => { console.error(error); }
      );
    }

    if(this.notAssignedSubscription(this.uploadPhotoSubscription)) {
      this.uploadPhotoSubscription = this.photoSelectDataService.uploadObs$.takeUntil(closeObs$).subscribe(
        (photos: any) => {
          this.uploadPhoto(photos);
        },
        (error : any) => { console.error(error); }
      );
    }
  }

  private notAssignedSubscription(sub: Subscription) {
    return !sub || sub.closed;
  }

  private unsubscribePhotoEvents() {
    [this.nextPhotoSubscription, this.uploadPhotoSubscription].forEach((sub : Subscription) => {
      if(sub && !sub.closed)
        sub.unsubscribe();
    });
  }
}
