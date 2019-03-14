import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  Input,
  OnChanges,
  AfterViewInit,
  AfterContentInit,
  DoCheck,
  AfterViewChecked,
  EventEmitter, Output
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Subject, Subscription,  Observable, from, merge } from 'rxjs';
import { filter, take, takeUntil, mergeMap, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { ChatService, CONCURRENT_UPLOAD } from '../../services/chat.service';
import { Message } from '../../models/message.model';
import { Constants, FORM_MODE, CONVERSATION_SELECT, CHAT_MESSAGES_GROUP_ } from '@wth/shared/constant';
import { ApiBaseService, WMessageService, StorageService, PhotoUploadService, CommonEventService, CommonEventHandler, CommonEvent } from '@wth/shared/services';
import { ZChatEmojiService } from '@wth/shared/shared/emoji/emoji.service';
import { WMediaSelectionService } from '@wth/shared/components/w-media-selection/w-media-selection.service';
import { MiniEditorComponent } from '@wth/shared/shared/components/mini-editor/mini-editor.component';
import { noteConstants } from '@notes/shared/config/constants';
import { ChatNoteListModalComponent } from '@shared/components/note-list/chat-module/modal/note-list-modal.component';
import { WUploader } from '@shared/services/w-uploader';
import { WTHEmojiService } from '@shared/components/emoji/emoji.service';
import { LongMessageModalComponent } from '@shared/components/modal/long-message-modal.component';
import { StripHtmlPipe } from './../../../../shared/shared/pipe/strip-html.pipe';
import { ChatMessageService } from '@chat/shared/services/chat-message.service';
import { ContactSelectionService } from '@chat/shared/selections/contact/contact-selection.service';


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
  @Input() conversation;
  @Input() maxLengthAllow = 2000;

  @Output() onCreate: EventEmitter<any> = new EventEmitter<any>();
  @Output() onUpdate: EventEmitter<any> = new EventEmitter<any>();
  @Output() onError: EventEmitter<any> = new EventEmitter<any>();

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
  private uploadingMessages: { [id: string]: Message } = {};
  private uploadedFiles: { [id: string]: any } = {};
  private stripHtml: StripHtmlPipe;
  private sub: Subscription;

  constructor(
    private chatService: ChatService,
    private mediaSelectionService: WMediaSelectionService,
    private apiBaseService: ApiBaseService,
    private store: Store<any>,
    private storage: StorageService,
    private fb: FormBuilder,
    private messageService: WMessageService,
    private chatMessageService: ChatMessageService,
    public commonEventService: CommonEventService,
    private uploadService: PhotoUploadService,
    private uploader: WUploader,
    private emojiService: WTHEmojiService,
    private contactSelectionService: ContactSelectionService,
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

    this.contactSelectionService.onSelect$.pipe(
      filter((event: any) => event.eventName === 'SHARE_CONTACT'),
      map((event: any) => event.payload.data),
      takeUntil(this.destroy$)
    ).subscribe((contacts: any) => {
      this.createMessage('contacts', contacts);
    });

  }

  ngOnChanges(changes: any) {
    if (changes && changes.conversation && changes.conversation.currentValue && changes.conversation.currentValue.blacklist) {
      this.setPlaceholder(this.placeholderBl);
    } else {
      this.setPlaceholder(this.placeholder);
    }
  }

  ngAfterViewInit() {
    this.focus();
  }

  openNotesSelection() {
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
      this.onCreate.emit({...this.message, group_id: this.conversation.id});
    }
    // if (e.keyCode === 13) {
    //   this.validateAndSend();
    // } else if (e.keyCode === 27) {
    //   this.cancelEditingMessage();
    //   return;
    // }
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

  handleImagePaste(file) {
    const { type } = file;
    const message = new Message({
      message: 'Sending file.....',
      message_type: 'file',
      content_type: type,
      meta_data: {}
    });

    const fakeMessage = this.chatMessageService.create(this.conversation.id, message);
    const uploadedMessage = this.uploadService.uploadPhotos([file]).toPromise();
    Promise.all([fakeMessage, uploadedMessage]).then(([fake, uploaded]) => {
      const updateMessage = { ...fake.data, file: uploaded['data'], content_type: type };
      this.messageService.update(updateMessage).toPromise();
    });
  }

  openContactsSelection() {
    // this.commonEventService.broadcast({
    //   channel: 'ZChatShareAddContactComponent',
    //   action: 'open',
    //   payload: {option: 'shareContacts'}
    // });
    this.contactSelectionService.open({
      type: 'SHARE_CONTACT',
      title: 'Select Contacts'
    });
  }

  openAddFile() {
    this.uploader.open('FileInput', '.w-uploader-file-input-container', {
      allowedFileTypes: null,
      beforeCallBackUrl: Constants.baseUrls.apiUrl + 'chat/messages/before_upload_file',
      afterCallBackUrl: Constants.baseUrls.apiUrl + 'chat/messages/after_upload_file',
      payload: {group_id: this.conversation.id},
      module: 'chat'
    });
  }

  onEmojiClick(e: any) {
    // $('#chat-message-text').append(`${e.replace(/\\/gi, '')}`);
    this.editor.addEmoj(`${e.replace(/\\/gi, '')}`);
  }

  openPhotosSelection() {
    this.mediaSelectionService.open({
      allowSelectMultiple: true,
      hiddenTabs: ['videos', 'playlists'],
      selectedTab: 'photos',
      filter: 'all',
      allowCancelUpload: true,
      allowedFileTypes: ['image/*'],
      beforeCallBackUrl: Constants.baseUrls.apiUrl + 'chat/messages/before_upload_file',
      afterCallBackUrl: Constants.baseUrls.apiUrl + 'chat/messages/after_upload_file',
      payload: { group_id: this.conversation.id },
    });

    this.mediaSelectionService.selectedMedias$
      .pipe(takeUntil(this.close$), filter((items: any[]) => items.length > 0))
      .subscribe(photos => {
        this.createMessage('photos', photos);
      });
  }

  createMessage(messageType: string, payload: any) {
    const messages = [];
    switch (messageType) {
      case 'photos':
        const photos = payload;
        photos.forEach(p => {
          messages.push(new Message({
            message_type: 'file',
            file_id: p.id,
            file_type: p.object_type,
          }));
        });
        break;
      case 'notes':
        const notes = payload;

        this.notesListModal.close();
        notes.forEach(p => {
          messages.push(new Message({
            message_type: 'file',
            file_id: p.object_id,
            file_type: p.object_type,
          }));
        });
        break;
      case 'contacts':
        const contacts = payload;
        contacts.forEach(contact => {
          messages.push(new Message({
            message_type: 'share_contact_message',
            file_id: contact.id,
            file_type: '::User',
          }));
        });
        break;
    }

    messages.forEach(message => {
      console.log('SEND MESSAGE:::', this.message);
      this.sendMessage(message);
    });

  }


  chooseDone(allMedia: any[]) {
    console.log('handle send photo', allMedia);
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
    const uploadingMessage = { ...this.uploadingMessages[fileId], file: this.uploadedFiles[fileId] };
    this.messageService.update(uploadingMessage).toPromise().then(response => {
      delete this.uploadingMessages[fileId];
      delete this.uploadedFiles[fileId];
    });
  }

  private validateMessage(): boolean {
    if (!this.messageService.notEmptyHtml(this.message.message)) {
      return false;
    }
    if (this.stripHtml.transform(this.message.message).length > this.maxLengthAllow ) {
      this.longMessageModal.open();
      return false;
    }
    return true;
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
      // this.messageService.scrollToBottom();
      // this.chatMessageService.createTextMessage(this.message.message);

      this.sendMessage(this.message);

      this.resetEditor();
    }
  }

  private sendMessage(message: any) {
    this.onCreate.emit({
      ...message,
      group_id: this.conversation.id,
    });
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
