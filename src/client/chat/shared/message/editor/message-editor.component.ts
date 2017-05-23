import { Component, ViewChild, HostListener, OnInit, HostBinding, OnDestroy, ElementRef } from '@angular/core';
import { ZChatEmojiService } from '../../emoji/emoji.service';
import { ChatService } from '../../services/chat.service';
import { PostPhotoSelectComponent } from '../../../../core/partials/zone/photo/post-upload-photos/post-photo-select.component';
import { PhotoModalDataService } from '../../../../core/shared/services/photo-modal-data.service';
import { Subscription } from 'rxjs';
import { PubSubEventService } from '../../../../core/shared/services/pub-sub/pub-sub-event.service';


declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'message-editor',
  templateUrl: 'message-editor.component.html',
  styleUrls: ['message-editor.component.css']
})

export class MessageEditorComponent implements OnInit, OnDestroy {
  emojiData: any = [];

  // Subscription list
  nextPhotoSubscription: Subscription;
  uploadPhotoSubscription: Subscription;

  private pressingShiftKey: boolean = false;

  quoteSubscription: Subscription;
  quoteMess: any = [];

  constructor(
    private chatService: ChatService,
    private photoSelectDataService: PhotoModalDataService,
    private pubSubEventService: PubSubEventService
  ) {
  }

  ngOnInit() {
    this.emojiData = ZChatEmojiService.emojis;
    // this.photoModal.action = 'UPLOAD';


  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(ev: KeyboardEvent) {

    // if pressing Shift key
    if (ev.keyCode == 16) {
      this.pressingShiftKey = true;
      // this.keyCtrlClass = 'active';
    }

    if (ev.keyCode == 13) {
      if (!this.pressingShiftKey) {
        ev.preventDefault();
      }
    }
  }

  @HostListener('document:keyup', ['$event'])
  onKeyUp(ev: KeyboardEvent) {
    if (ev.keyCode == 16) {
      this.pressingShiftKey = false;
    }
    // pressing Enter Key
    if (ev.keyCode == 13) {
      if (!this.pressingShiftKey) {
        this.send(true);
      }
    }
    this.quoteSubscription.unsubscribe();
  }

  send(enter?: boolean) {

    let message: string = $('#chat-message-text').html();
    if (enter) {
      message = message.replace('<div><br></div>', '');
    }

    this.chatService.sendTextMessage(message);
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

  ngOnDestroy() {
    this.unsubscribePhotoEvents();
    this.pubSubEventService.unsubscribe();
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
