import { Component, ViewChild, HostListener, OnInit, HostBinding, OnDestroy, ElementRef } from '@angular/core';
import { ZChatEmojiService } from '../../emoji/emoji.service';
import { ChatService } from '../../services/chat.service';
import { PostPhotoSelectComponent } from '../../../../core/partials/zone/photo/post-upload-photos/post-photo-select.component';
import { PhotoModalDataService } from '../../../../core/shared/services/photo-modal-data.service';
import { Subscription } from 'rxjs';
import { PubSubEventService } from '../../../../core/shared/services/pub-sub/pub-sub-event.service';
import { FORM_MODE } from '../../../../core/shared/constant/chat-constant';
import { FormGroup, AbstractControl, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Message } from '../../models/message.model';


declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'message-editor',
  templateUrl: 'message-editor.component.html',
  styleUrls: ['message-editor.component.css']
})

export class MessageEditorComponent implements OnInit, OnDestroy {
  emojiData: any = [];

  mode: string;
  // Subscription list
  nextPhotoSubscription: Subscription;
  uploadPhotoSubscription: Subscription;

  message: Message = new Message();
  appendedMessages: Array<Message> = new Array<Message>();
  messageEditorForm: FormGroup;
  messageCtrl: FormControl;

  private pressingShiftKey: boolean = false;
  private messageEditorId = '#chat-message-text';

  constructor(
    private chatService: ChatService,
    private photoSelectDataService: PhotoModalDataService,
    private fb: FormBuilder
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.emojiData = ZChatEmojiService.emojis;
    // this.photoModal.action = 'UPLOAD';
  }

  createForm() {
    // Form controls
    // this.message.message = '';
    this.messageEditorForm = new FormGroup({
      message: new FormControl(this.message.message, Validators.required)//[this.message.message, null]
      // message: [this.message.message, Validators.required]//[this.message.message, null]

    });
    this.messageCtrl = <FormControl>this.messageEditorForm.controls['message'];
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
    // pressed Enter Key
    if (ev.keyCode == 13) {
      if (!this.pressingShiftKey) {
        // if (!this.pressingShiftKey && this.messageEditorForm.valid) {

          this.send(true);
      }
    }

    // pressed ESC
    if (ev.keyCode == 27) {
      this.cancelEditingMessage();
    }
  }


  create(message: any) {
    this.mode = FORM_MODE.CREATE;
  }


  edit(message: any) {
    this.mode = FORM_MODE.EDIT;
  }


  updateAttributes(attributes: any) {
    if('message' in attributes) {
      this.message = attributes.message;
      if(this.message.message_type == 'text') {
        this.setEditor(this.message);
      }
    }
    if('appendedMessage' in attributes) {
      this.appendedMessages.push(attributes.appendedMessage);
      this.message = attributes.appendedMessage;
      // this.message.message += this.buildQuoteMessage(attributes.appendedMessage);

      console.log('testing:::::::::', this.appendedMessages[0]);
    }
    if('mode' in attributes) {
      this.mode = attributes.mode;
    }
  }

  focus() {
      //set background color #ffd when editing
  }

  cancelEditingMessage() {
    if (this.mode == FORM_MODE.EDIT) {
      this.mode = FORM_MODE.CREATE;
    } else {

    }
    this.resetEditor();
  }

  send(enter?: boolean) {

    let message: string = $(this.messageEditorId).html();

    if (enter) {
      // message = message.replace('<div><br></div>', '');
    }
    this.message.message = message;

    if (this.mode == FORM_MODE.EDIT) {
      this.chatService.updateMessage(this.message.group_id, this.message).subscribe(
        (response: any) => {
          this.mode = FORM_MODE.CREATE;
          this.resetEditor();
      },
      error => {
      });

    } else {
      this.chatService.sendTextMessage(this.message.message, {toTop: true});
      this.resetEditor();
    }
  }

  onEmojiClick(e: any) {
    $('#chat-message-text').append(`${e.replace(/\\/gi, '')}`);
    this.placeCaretAtEnd(document.getElementById('chat-message-text'));
  }

  onChangeValue(event: any) {
    console.log('changing.............', event.target.innerHtml);
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

  private buildQuoteMessage(message: any): string {
    return `<blockquote contenteditable="false">      
    <strong *ngIf="message.is_quote">${message.display.name}</strong>
    <span *ngIf="message.is_quote">${message.created_at}</span>
    <p [innerHtml]="#{message.message}"></p>
      </blockquote>
      <br>`;
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

  private resetEditor() {
    this.message = new Message();
    this.setEditor(this.message);
    // Remove emoji and auto focus
    $('#chat-message-text').html('');
    $('#chat-message-text').focus();
  }

  private setEditor(message: Message) {
    // $(this.messageEditorId).html(message.message)
  }
}
