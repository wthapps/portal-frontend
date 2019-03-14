import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectionStrategy, OnChanges } from '@angular/core';
import { Router } from '@angular/router';

import { ChatService } from '../services/chat.service';
import { Constants, CHAT_ACTIONS, ChatConstant, CONVERSATION_SELECT } from '@wth/shared/constant';
import { CommonEvent, CommonEventService, WMessageService, StorageService } from '@wth/shared/services';

declare var _: any;

const MEDIA_PATH_MAPPINGS = {
  'Media::Photo': 'photos',
  'Media::Video': 'videos'
};

@Component({
  selector: 'message-item',
  templateUrl: 'message-item.component.html',
  styleUrls: ['message-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageItemComponent implements OnInit {
  @Input() message: any;
  @Input() byMe: boolean;
  @Input() prevMessage: any;
  @Input() contactItem: any;
  @Input() emojiMap: any;
  @Input() selectedConversation;
  @Output() onAddContact: EventEmitter<any> = new EventEmitter<any>();
  @Output() event: EventEmitter<any> = new EventEmitter<any>();


  readonly tooltip: any = Constants.tooltip;
  readonly noteUrl: any = Constants.baseUrls.note;
  readonly socialUrl: any = Constants.baseUrls.social;
  readonly actions = CHAT_ACTIONS;
  readonly profileUrl: any = ChatConstant.profileUrl;
  readonly NO_ACTION_MESSAGES = ['message_deleted', 'message_cancel', 'request', 'request_accepted'];

  private modifiedMessage: any;

  constructor(
    private router: Router,
    private chatService: ChatService,
    private storageService: StorageService,
    private pubSubEventService: CommonEventService,
    private messageService: WMessageService
  ) {
    // this.profileUrl = this.chatService.constant.profileUrl;
  }

  ngOnInit() {
    // console.log(this.message);

  }

  onPreviewPhoto(message: any) {
    if (!_.get(message, 'file.uuid')) { return; }
    // const currentConversation = this.storageService.get(CONVERSATION_SELECT);
    this.router.navigate([{
      outlets: {
        modal: [
          'preview',
          message.file.uuid,
          {
            object: 'conversation',
            parent_uuid: _.get(this.selectedConversation, 'group_uuid'),
            only_preview: true
          }
        ]
      }
    }], { queryParamsHandling: 'preserve', preserveFragment: true });
  }

  doAction(event: CommonEvent) {
    const editingEvent = _.cloneDeep(event); // this helps current value doesn't change when users edit message

    this.pubSubEventService.broadcast(editingEvent);
  }

  copy() {
    this.doAction({
      channel: 'ConversationDetailComponent',
      action: CHAT_ACTIONS.CHAT_MESSAGE_COPY,
      payload: this.message
    });
  }

  quote() {
    this.doAction({
      channel: 'ConversationDetailComponent',
      action: CHAT_ACTIONS.CHAT_MESSAGE_QUOTE,
      payload: this.message
    });
  }

  edit() {
    this.doAction({
      channel: 'ConversationDetailComponent',
      action: CHAT_ACTIONS.CHAT_MESSAGE_EDIT,
      payload: this.message
    });
  }

  delete() {
    this.doAction({
      channel: 'ConversationDetailComponent',
      action: CHAT_ACTIONS.CHAT_MESSAGE_DELETE,
      payload: this.message
    });
  }

  download() {
    this.doAction({
      channel: 'ConversationDetailComponent',
      action: CHAT_ACTIONS.CHAT_MESSAGE_DOWNLOAD,
      payload: this.message
    });
  }

  cancel() {
    this.doAction({
      channel: 'ConversationDetailComponent',
      action: CHAT_ACTIONS.CHAT_MESSAGE_CANCEL,
      payload: this.message
    });
  }

  doEvent(event: any) {
    this.event.emit({
      channel: 'chatCommonEvent',
      action: event.action,
      data: this.message
    });
  }

  onAdd() {
    this.onAddContact.emit(this.message.file);
  }

  onShareContact(data: any) {
    if (data.action === 'cancel') {
      this.delete();
    }
    if (data.action === 'resend') {
      // this.chatService.shareContact([this.message.display.share_contact.id]);
      this.chatService.selectContactByPartnerId(this.message.display.share_contact.id);
    }
  }

  cancelContactRequest(contact: any) { }

  hasShowOwner(): boolean {
    if (this.prevMessage == null) {
      return true;
    }
    if (
      this.message.user &&
      this.prevMessage.user &&
      this.message.user.id === this.prevMessage.user.id
    ) {
      return false;
    }
    return true;
  }

  // hasShowDate(): boolean {
  //   if (this.prevMessage == null || this.message.status == 'pending') {
  //     return true;
  //   }
  //   if (
  //     this.message.created_at &&
  //     this.prevMessage.created_at &&
  //     this.message.created_at.slice(0, 10) ===
  //       this.prevMessage.created_at.slice(0, 10)
  //   ) {
  //     return false;
  //   }
  //   return true;
  // }

  onImgLoaded() {
    // setTimeout(() => {
    //   this.messageService.scrollToBottom();
    // }, 200);
  }
}
