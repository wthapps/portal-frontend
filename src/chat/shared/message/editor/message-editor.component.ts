import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation, Input, OnChanges, AfterViewInit, AfterContentInit, DoCheck, AfterViewChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Subject, Subscription,  Observable, from, merge } from 'rxjs';
import { filter, take, takeUntil, mergeMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { ChatService, CONCURRENT_UPLOAD } from '../../services/chat.service';
import { Message } from '../../models/message.model';
import { Constants, FORM_MODE, CONVERSATION_SELECT, CHAT_MESSAGES_GROUP_ } from '@wth/shared/constant';
import { ApiBaseService, WMessageService, StorageService, PhotoUploadService, CommonEventService, CommonEventHandler } from '@wth/shared/services';
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
import { ChatMessageService } from '@chat/shared/services/chat-message.service';


declare var $: any;
declare var _: any;

@Component({
  selector: 'message-editor',
  templateUrl: 'message-editor.component.html',
  styleUrls: ['message-editor.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MessageEditorComponent extends CommonEventHandler implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @ViewChild('miniEditor') editor: MiniEditorComponent;
  @ViewChild('noteList') notesListModal: ChatNoteListModalComponent;
  @ViewChild('longMessageModal') longMessageModal: LongMessageModalComponent;
  @Input() isDisabled = false;
  @Input() contactSelect;
  @Input() maxLengthAllow = 2000;
  channel = 'MessageEditorComponent';

  readonly tooltip: any = Constants.tooltip;
  emojiData: any = [];
  mode: string;
  placeholder = 'Type a message';
  placeholderBl = 'You can\'t chat with blacklisted contact. Remove from blacklist to continue';

  message: Message = new Message();
  appendedMessages: Array<Message> = new Array<Message>();
  messageEditorForm: FormGroup;
  messageCtrl: FormControl;

  selectEmojiSub: Subscription;
  destroy$ = new Subject();

  private close$: Observable<any>;
  private currentFileId: string;
  private uploadingMessages: {[id: string]: Message} = {};
  private uploadedFiles: {[id: string]: any} = {};
  private stripHtml: StripHtmlPipe;
  private sub: Subscription;

  constructor(
    private chatService: ChatService,
    private mediaSelectionService: WMediaSelectionService,
    private apiBaseService: ApiBaseService,
    private store: Store<any>,
    private storage: StorageService,
    private fb: FormBuilder,
    private addContactService:  ZChatShareAddContactService,
    private messageService: WMessageService,
    private chatMessageService: ChatMessageService,
    public commonEventService: CommonEventService,
    private uploadService: PhotoUploadService,
    private uploader: WUploader,
    private emojiService: WTHEmojiService
  ) {
    super(commonEventService);
    this.createForm();
    this.stripHtml = new StripHtmlPipe();

    this.close$ = merge(
      this.mediaSelectionService.open$,
      this.destroy$
    );

  }

  ngOnInit() {
    this.emojiData = ZChatEmojiService.emojis;
    // this.photoModal.action = 'UPLOAD';
    // capture event while upload
    this.uploader.event$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(event => {
      this.sendFileEvent(event);
    });
  }

  ngOnChanges(changes: any) {
    if (changes && changes.contactSelect && changes.contactSelect.currentValue && changes.contactSelect.currentValue.blacklist) {
      this.setPlaceholder(this.placeholderBl);
    } else {
      this.setPlaceholder(this.placeholder);
    }
  }

  ngAfterViewInit() {
    this.focus();
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
          this.chatMessageService.createFileMessage(note);
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
    if (this.editor) {
      this.editor.quill.root.dataset.placeholder = message;
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
    if (this.editor) { this.editor.focus(); }
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

  handleImagePaste(file) {
    const { type} = file;
      const message = new Message({
        message: 'Sending file.....',
        message_type: 'file',
        content_type: type,
        meta_data: {}
      });

    const fakeMessage = this.chatMessageService.create(this.contactSelect.group_id, message);
    const uploadedMessage = this.uploadService.uploadPhotos([file]).toPromise();
    Promise.all([fakeMessage, uploadedMessage]).then(([fake, uploaded]) => {
    const updateMessage = {...fake.data, file: uploaded['data'], content_type: type};
    this.messageService.update(updateMessage).toPromise();
    });
  }

  shareContacts() {
    this.commonEventService.broadcast({
      channel: 'ZChatShareAddContactComponent',
      action: 'open',
      payload: {option: 'shareContacts'}
    });
  }

  openAddFile() {
    this.uploader.open('FileInput', '.w-uploader-file-input-container', {
      allowedFileTypes: null,
      beforeCallBackUrl: Constants.baseUrls.apiUrl + 'zone/chat/message/before_upload_file',
      afterCallBackUrl: Constants.baseUrls.apiUrl + 'zone/chat/message/after_upload_file',
      payload: {group_id: this.contactSelect.group_id},
      module: 'chat'
    });
  }

  onEmojiClick(e: any) {
    // $('#chat-message-text').append(`${e.replace(/\\/gi, '')}`);
    this.editor.addEmoj(`${e.replace(/\\/gi, '')}`);
  }

  onChangeValue(event: any) {
    // console.log('changing.............', event.target.innerHtml);
  }

  onOpenSelectPhotos() {
    this.mediaSelectionService.open({
      allowSelectMultiple: true,
      hiddenTabs: ['videos', 'playlists'], allowCancelUpload: true,
      beforeCallBackUrl: Constants.baseUrls.apiUrl + 'zone/chat/message/before_upload_file',
      afterCallBackUrl: Constants.baseUrls.apiUrl + 'zone/chat/message/after_upload_file',
      payload: { group_id: this.contactSelect.group_id },
  });

    this.mediaSelectionService.selectedMedias$
      .pipe(takeUntil(this.close$), filter((items: any[]) => items.length > 0))
      .subscribe(photos => {
        this.chooseDone(photos);
      });
  }

  chooseDone(allMedia: any[]) {
    // Create multiple chat messages in batches of CONCURRENT_UPLOAD (default value is 2)
    from(allMedia).pipe(
      mergeMap(media => this.chatMessageService.createMediaMessage(media),
      (valueFromSource, valueFromInner) => {
        return valueFromInner;
      },
      CONCURRENT_UPLOAD
      )
    ).subscribe((val) => {
      // send message channel will do it
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
        this.editor.addEmoj(data.shortname);
      });
  }

  private sendFileEvent(event: any) {
    switch (event.action) {
      case 'file-added': {

      }
        break;
      case 'start':
        break;
      case 'before-upload': {

      }
        break;
      case 'progress': {
        break;
      }
      case 'success': {
        const { id } = event.payload.file;
        this.uploadedFiles[id] = event.payload.resp;
        if (!this.uploadingMessages[id]) {
          return;
        }

        this.updateUploadingMessage(id);
        break;
      }
    }
  }

  private updateUploadingMessage(fileId: string) {
    if (!this.uploadingMessages[fileId] || !this.uploadedFiles[fileId]) {
      return;
    }
    const uploadingMessage = {...this.uploadingMessages[fileId], file: this.uploadedFiles[fileId]};
    this.messageService.update(uploadingMessage).toPromise().then(response => {
      delete this.uploadingMessages[fileId];
      delete this.uploadedFiles[fileId];
    });
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
      this.chatMessageService.createTextMessage(this.message.message);

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
