import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

import { ChatService } from '../services/chat.service';
import { Constants, CHAT_ACTIONS, ChatConstant } from '@wth/shared/constant';
import { CommonEvent, CommonEventService, WMessageService } from '@wth/shared/services';

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
    private pubSubEventService: CommonEventService,
    private messageService: WMessageService
  ) {
    // this.profileUrl = this.chatService.constant.profileUrl;
  }

  ngOnInit() {
    // // this.contactItem = this.chatService.getContactSelect();
    // // ByMe
    // if (this.message.display && this.message.display.id) {
    //   this.message.byMe =
    //     this.chatService.userService.getSyncProfile().id ==
    //     this.message.display.id;
    // } else {
    //   this.message.file = {
    //     thumbnail_url:
    //       'https://s3-us-west-2.amazonaws.com/env-staging-oregon/portal-frontend/system/thumbnails/generic_files_upload_default.png'
    //   };
    // }
  }

  onPreviewPhoto(message: any) {
    this.router.navigate([{
      outlets: {
        modal: [
          'preview',
          message.file.uuid,
          {
            object: 'conversation',
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
      channel: 'chatCommonEvent',
      action: CHAT_ACTIONS.CHAT_MESSAGE_COPY,
      payload: this.message
    });
  }

  quote() {
    this.doAction({
      channel: 'chatCommonEvent',
      action: CHAT_ACTIONS.CHAT_MESSAGE_QUOTE,
      payload: this.message
    });
  }

  edit() {
    this.doAction({
      channel: 'chatCommonEvent',
      action: CHAT_ACTIONS.CHAT_MESSAGE_EDIT,
      payload: this.message
    });
  }

  delete() {
    this.doAction({
      channel: 'chatCommonEvent',
      action: CHAT_ACTIONS.CHAT_MESSAGE_DELETE,
      payload: this.message
    });
  }

  download() {
    this.doAction({
      channel: 'chatCommonEvent',
      action: CHAT_ACTIONS.CHAT_MESSAGE_DOWNLOAD,
      payload: this.message
    });
  }

  cancel() {
    this.doAction({
      channel: 'chatCommonEvent',
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

  onAdd(data: any) {
    this.onAddContact.emit(this.message.display.share_contact);
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

  cancelContactRequest(contact: any) {}

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

  hasShowDate(): boolean {
    if (this.prevMessage == null) {
      return true;
    }
    if (
      this.message.created_at &&
      this.prevMessage.created_at &&
      this.message.created_at.slice(0, 10) ===
        this.prevMessage.created_at.slice(0, 10)
    ) {
      return false;
    }
    return true;
  }

  onImgLoaded() {
    // setTimeout(() => {
    //   this.messageService.scrollToBottom();
    // }, 200);
  }
}
