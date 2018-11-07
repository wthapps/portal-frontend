import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation, Input, OnChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Subject, Subscription,  Observable, from } from 'rxjs';
import { filter, map, take, takeUntil, merge, mergeMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { ChatService, CONCURRENT_UPLOAD } from '../../services/chat.service';
import { Message } from '../../models/message.model';
import { Constants, FORM_MODE } from '@wth/shared/constant';
import { ApiBaseService, WMessageService } from '@wth/shared/services';
import { ZChatEmojiService } from '@wth/shared/shared/emoji/emoji.service';
import { WMediaSelectionService } from '@wth/shared/components/w-media-selection/w-media-selection.service';
import { MiniEditorComponent } from '@wth/shared/shared/components/mini-editor/mini-editor.component';
import { noteConstants } from '@notes/shared/config/constants';
import { ChatNoteListModalComponent } from '@shared/components/note-list/chat-module/modal/note-list-modal.component';
import { WUploader } from '@shared/services/w-uploader';
import { WTHEmojiService } from '@shared/components/emoji/emoji.service';
import { ZChatShareAddContactService } from '@chat/shared/modal/add-contact.service';
import { LongMessageModalComponent } from '@shared/components/modal/long-message-modal.component';
import { StripHtmlPipe } from './../../../../shared/shared/pipe/strip-html.pipe';
import { MessageService } from '@shared/shared/components/chat-support/message/message.service';


declare var $: any;

@Component({
  selector: 'message-editor',
  templateUrl: 'message-editor.component.html',
  styleUrls: ['message-editor.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MessageEditorComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild(MiniEditorComponent) editor: MiniEditorComponent;
  @ViewChild('noteList') notesListModal: ChatNoteListModalComponent;
  @ViewChild('longMessageModal') longMessageModal: LongMessageModalComponent;
  @ViewChild('miniEditor') miniEditor: MiniEditorComponent;
  @Input() isDisabled = false;
  @Input() contactSelect;
  @Input() maxLengthAllow = 2000;

  readonly tooltip: any = Constants.tooltip;
  emojiData: any = [];
  mode: string;
  placeholder = 'Type message here';
  placeholderBl = 'You can\'t chat with blacklisted contact. Remove from blacklist to continue';

  message: Message = new Message();
  appendedMessages: Array<Message> = new Array<Message>();
  messageEditorForm: FormGroup;
  messageCtrl: FormControl;

  selectEmojiSub: Subscription;
  destroy$ = new Subject();

  private currentFileId: string;
  private uploadingMessage: any;
  private stripHtml: StripHtmlPipe;
  private sub: Subscription;

  constructor(
    private chatService: ChatService,
    private mediaSelectionService: WMediaSelectionService,
    private apiBaseService: ApiBaseService,
    private store: Store<any>,
    private fb: FormBuilder,
    private addContactService:  ZChatShareAddContactService,
    private messageService: WMessageService,
    private uploader: WUploader,
    private emojiService: WTHEmojiService
  ) {
    this.createForm();
    this.stripHtml = new StripHtmlPipe();
  }

  ngOnInit() {
    this.emojiData = ZChatEmojiService.emojis;
    // this.photoModal.action = 'UPLOAD';


    // capture event while upload
    this.uploader.event$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(event => {
      console.log('event: ', event);
      this.sendFileEvent(event);
    });
  }

  ngOnChanges(changes: any) {
    if (changes && changes.contactSelect && changes.contactSelect.currentValue && changes.contactSelect.currentValue.black_list) {
      this.setPlaceholder(this.placeholderBl);
    } else {
      this.setPlaceholder(this.placeholder);
    }
  }
  noteSelectOpen() {
    this.notesListModal.open();
  }

  noteSelectOnInsert() {
    this.store
      .select('notes')
      .pipe(take(1))
      .subscribe(state => {
        const notes: any = state.objects.filter(
          item =>
            item.object_type === noteConstants.OBJECT_TYPE.NOTE &&
            item.selected === true
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
      message: new FormControl(this.message.message, Validators.required)
    });
    this.messageCtrl = <FormControl>this.messageEditorForm.controls['message'];
  }

  setPlaceholder(message: any = this.placeholder) {
    if (this.miniEditor) {
      this.miniEditor.quill.root.dataset.placeholder = message;
    }
  }

  handleKeyUp(e: any) {
    if (e.keyCode === 13) {
      this.validateAndSend();
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
    this.editor.focus();
  }

  cancelEditingMessage() {
    if (this.mode === FORM_MODE.EDIT) {
      this.mode = FORM_MODE.CREATE;
    }
    this.resetEditor();
  }

  validateAndSend() {
    if (!this.messageService.notEmptyHtml(this.message.message)) {
      return;
    }
    if (this.stripHtml.transform(this.message.message).length > this.maxLengthAllow ) {
        // console.error('Chat messages exceed maximum length of ', this.maxLengthAllow);
        this.longMessageModal.open();
        return;
    }
    this.send();
  }


  shareContacts() {
    this.addContactService.open('shareContact');
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
  }

  onChangeValue(event: any) {
    console.log('changing.............', event.target.innerHtml);
  }

  onOpenSelectPhotos() {
    this.mediaSelectionService.open({ allowSelectMultiple: true, allowCancelUpload: true });

    this.mediaSelectionService.selectedMedias$
      .pipe(takeUntil(this.destroy$), filter((items: any[]) => items.length > 0))
      .subscribe(photos => {
        this.chooseDone(photos);
      });

    // this.mediaSelectionService.uploadingMedias$
    //   .pipe(takeUntil(this.destroy$), map(([file, dataUrl]) => [file]))
    //   .subscribe((photos: any) => {
    //     this.uploadFile(photos);
    //   });
  }

  chooseDone(allMedia: any[]) {
    // Create multiple chat messages in batches of CONCURRENT_UPLOAD (default value is 4)
    from(allMedia).pipe(
      mergeMap(media => this.chatService.uploadMediaOnWeb(media),
      (valueFromSource, valueFromPromise) => {
        return `Source: ${valueFromSource}, Promise: ${valueFromPromise}`;
      },
      CONCURRENT_UPLOAD
      )
    ).subscribe((val) => {
      console.log('choose done: ', val);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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

  private sendFileEvent(event: any) {

    switch (event.action) {
      case 'start':
        // const files = this.uploader.uppy.getFiles();
        // files.forEach(file => {
        //   const message = new Message({
        //     message: 'Sending file.....',
        //     message_type: 'file',
        //     content_type: file.meta.type,
        //     meta_data: {file: {id: file.id, name: file.name, progress: file.progress, meta: file.meta}}
        //   });
        //   this.chatService.createMessage(null, message).subscribe(response => {
        //     currentMessage = response.data;
        //     console.log('current event message:::', event);
        //   });
        // });
        // const file = event.payload.file;
        break;
      case 'progress':
        const file = event.payload.file;
        const { id, name, progress, meta } = file;
        if (this.currentFileId !== file.id) {
          this.currentFileId = id;
          const message = new Message({
            message: 'Sending file.....',
            message_type: 'file',
            content_type: meta.type,
            meta_data: {file: {id, name, progress, meta }}
          });
          this.chatService.createMessage(null, message).subscribe(response => {
            this.uploadingMessage = {...response.data, content_type: meta.type};
          });
        }
        break;
      case 'success':
        if (this.uploadingMessage &&
          this.uploadingMessage.message_type === 'file' &&
          this.uploadingMessage.sending_status === 1) {
          this.messageService.update(this.uploadingMessage).subscribe(response => {
            console.log('sending file success', response.data);
          });
        }
        // update current message
        break;
    }
  }


  private send() {
    if (this.mode === FORM_MODE.EDIT) {
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

  private buildQuoteMessage(message: any): string {
    return `<blockquote contenteditable="false">
    <strong *ngIf="message.is_quote">${message.user.name}</strong>
    <span *ngIf="message.is_quote">${message.created_at}</span>
    <p [innerHtml]="#{message.message}"></p>
      </blockquote>
      <br>`;
  }

  private resetEditor() {
    this.message = new Message();
    this.setEditor(this.message);
    this.focus();
  }

  private setEditor(message: Message) {
    // $(this.messageEditorId).html(message.message)
  }
}
