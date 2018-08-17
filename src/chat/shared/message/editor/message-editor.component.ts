import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/observable/merge';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { ChatService } from '../../services/chat.service';
import { Message } from '../../models/message.model';
import { Constants, FORM_MODE } from '@wth/shared/constant';
import { ApiBaseService, WMessageService } from '@wth/shared/services';
import { ZChatEmojiService } from '@wth/shared/shared/emoji/emoji.service';
import { Observable } from 'rxjs/Observable';
import { componentDestroyed } from 'ng2-rx-componentdestroyed';
import { filter, map, take, takeUntil } from 'rxjs/operators';
import { WMediaSelectionService } from '@wth/shared/components/w-media-selection/w-media-selection.service';
import { MiniEditorComponent } from '@wth/shared/shared/components/mini-editor/mini-editor.component';
import { Store } from '@ngrx/store';
import { noteConstants } from '@notes/shared/config/constants';
import { ChatNoteListModalComponent } from '@shared/components/note-list/chat-module/modal/note-list-modal.component';
import { WUploader } from '@shared/services/w-uploader';
import { WTHEmojiService } from '@shared/components/emoji/emoji.service';


declare var $: any;

@Component({
  selector: 'message-editor',
  templateUrl: 'message-editor.component.html',
  styleUrls: ['message-editor.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MessageEditorComponent implements OnInit, OnDestroy {
  @ViewChild(MiniEditorComponent) editor: MiniEditorComponent;
  @ViewChild('noteList') notesListModal: ChatNoteListModalComponent;

  readonly tooltip: any = Constants.tooltip;
  emojiData: any = [];
  mode: string;

  message: Message = new Message();
  appendedMessages: Array<Message> = new Array<Message>();
  messageEditorForm: FormGroup;
  messageCtrl: FormControl;

  selectEmojiSub: Subscription;

  constructor(
    private chatService: ChatService,
    // private photoSelectDataService: PhotoModalDataService,
    private mediaSelectionService: WMediaSelectionService,
    private apiBaseService: ApiBaseService,
    private store: Store<any>,
    private fb: FormBuilder,
    private messageService: WMessageService,
    private uploader: WUploader,
    private emojiService: WTHEmojiService
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.emojiData = ZChatEmojiService.emojis;
    // this.photoModal.action = 'UPLOAD';
  }

  noteSelectOpen() {
    this.notesListModal.open();
  }

  noteSelectOnInsert() {
    this.store
      .select('notes')
      .take(1)
      .subscribe(state => {
        const notes: any = state.objects.filter(
          item =>
            item.object_type == noteConstants.OBJECT_TYPE.NOTE &&
            item.selected == true
        );
        this.notesListModal.close();
        notes.forEach(note => {
          this.apiBaseService
            .post('zone/chat/message', {
              data: {
                type: 'file',
                id: note.object_id,
                object: note.object_type
              },
              group_id: this.chatService.getContactSelect().value.group_id
            })
            .subscribe(res => {
              // Not implements because channel will get message automacticaly
            });
        });
      });
  }

  createForm() {
    // Form controls
    this.messageEditorForm = new FormGroup({
      message: new FormControl(this.message.message, Validators.required) //[this.message.message, null]
    });
    this.messageCtrl = <FormControl>this.messageEditorForm.controls['message'];
  }

  handleKeyUp(e: any) {
    if (e.keyCode === 13 && this.messageService.notEmptyHtml(this.message.message)) {
      this.send(true);
    } else if (e.keyCode === 27) {
      this.cancelEditingMessage();
      return;
    }
  }

  create(message: any) {
    this.mode = FORM_MODE.CREATE;
  }

  edit(message: any) {
    this.mode = FORM_MODE.EDIT;
  }

  updateAttributes(attributes: any) {
    if ('message' in attributes) {
      this.message = attributes.message;
      if (this.message.message_type === 'text') {
        this.setEditor(this.message);
      }
    }
    if ('appendedMessage' in attributes) {
      this.appendedMessages.push(attributes.appendedMessage);
      this.message = attributes.appendedMessage;
      // this.message.message += this.buildQuoteMessage(attributes.appendedMessage);
    }
    if ('mode' in attributes) {
      this.mode = attributes.mode;
    }
  }

  focus() {
    // set background color #ffd when editing
  }

  cancelEditingMessage() {
    if (this.mode == FORM_MODE.EDIT) {
      this.mode = FORM_MODE.CREATE;
    }
    this.resetEditor();
  }

  send(enter?: boolean) {
    if (this.mode == FORM_MODE.EDIT) {
      this.chatService
        .updateMessage(this.message.group_id, this.message)
        .subscribe((response: any) => {
          this.mode = FORM_MODE.CREATE;
          this.resetEditor();
        });
    } else {
      this.messageService.scrollToBottom();
      this.chatService.sendTextMessage(this.message.message, { toTop: true });
      this.resetEditor();
    }
  }

  sendMessage(type: string) {
    if (type === 'file') {
      this.uploader.open('FileInput', '.w-uploader-file-input-container', {
        allowedFileTypes: null,
        willCreateMessage: true,
        module: 'chat'
      });
    }
  }

  onEmojiClick(e: any) {
    // $('#chat-message-text').append(`${e.replace(/\\/gi, '')}`);
    this.editor.addEmoj(`${e.replace(/\\/gi, '')}`);
    // this.placeCaretAtEnd(document.getElementById('chat-message-text'));
  }

  onChangeValue(event: any) {
    console.log('changing.............', event.target.innerHtml);
  }

  onOpenSelectPhotos() {
    this.mediaSelectionService.open();
    this.mediaSelectionService.setMultipleSelection(true);

    let close$: Observable<any> = Observable.merge(
      this.mediaSelectionService.open$,
      componentDestroyed(this)
    );
    this.mediaSelectionService.selectedMedias$
      .pipe(takeUntil(close$), filter((items: any[]) => items.length > 0))
      .subscribe(photos => {
        this.chooseDone(photos);
      });

    this.mediaSelectionService.uploadingMedias$
      .pipe(takeUntil(close$), map(([file, dataUrl]) => [file]))
      .subscribe((photos: any) => {
        this.uploadFile(photos);
      });
  }

  chooseDone(e: any) {
    // this.photoModal.close();
    for (let photo of e) {
      this.chatService.uploadPhotoOnWeb(photo);
    }
  }

  changeFiles(event: any) {
    let files = event.target.files;
    if (files.length == 0) {
      return;
    }
    this.uploadFile(files);
  }

  uploadFile(files: any) {
    this.chatService.createUploadingFile(files);
  }

  placeCaretAtEnd(el: any) {
    el.focus();
    if (
      typeof window.getSelection != 'undefined' &&
      typeof document.createRange != 'undefined'
    ) {
      let range: any = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      let sel: any = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }

  ngOnDestroy() {
  }

  showEmojiBtn(event: any) {
    this.emojiService.show(event);

    if (this.selectEmojiSub && !this.selectEmojiSub.closed) {
      this.selectEmojiSub.unsubscribe();
    }
    this.selectEmojiSub = this.emojiService.selectedEmoji$
      .pipe(take(1))
      .subscribe(data => {
        console.log(data);
        this.editor.addEmoj(data.shortname);
      });
  }

  private buildQuoteMessage(message: any): string {
    return `<blockquote contenteditable="false">
    <strong *ngIf="message.is_quote">${message.display.name}</strong>
    <span *ngIf="message.is_quote">${message.created_at}</span>
    <p [innerHtml]="#{message.message}"></p>
      </blockquote>
      <br>`;
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
