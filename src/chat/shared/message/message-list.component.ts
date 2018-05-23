import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  ElementRef
} from '@angular/core';
import { ChatService } from '../services/chat.service';
import { ZChatShareRequestContactComponent } from '../modal/request-contact.component';
import { MessageService } from '@chat/shared/message/message.service';

declare var _: any;
declare var $: any;

@Component({
  selector: 'message-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'message-list.component.html',
  styleUrls: ['message-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MessageListComponent implements OnInit {
  @ViewChild('request') requestModal: ZChatShareRequestContactComponent;
  @ViewChild('listEl') listEl: ElementRef;

  item: any;
  contactItem: any;
  prevMessage: any;
  scrollDistance: number = 1000;

  constructor(
    private chatService: ChatService,
    private ref: ChangeDetectorRef,
    private messageService: MessageService
  ) {
    this.messageService.scrollToBottom$.subscribe((res: boolean) => {
      if (res) {
        this.listEl.nativeElement.scrollTop = this.listEl.nativeElement.scrollHeight;
      }
    });
  }

  ngOnInit() {
    setInterval(() => {
      this.item = this.chatService.getCurrentMessages();
      this.contactItem = this.chatService.getContactSelect();
      this.ref.markForCheck();
    }, 200);
  }

  onLoadMore() {
    this.chatService.loadMoreMessages();
  }

  scrollDown() {
    if ($('#chat-message-text').is(':focus'))
      this.chatService.markAsRead(this.contactItem.value.group_id);
  }

  onAddContact(contact: any) {
    this.requestModal.contact = contact;
    this.requestModal.modal.open();
  }

  doEvent(event: any) {
    switch (event.action) {
      case 'CONTACT_REQUEST_CREATE':
        this.requestModal.contact = event.data.receiver;
        this.requestModal.modal.open();
        break;
      case 'CONTACT_REQUEST_CANCEL':
        this.chatService.chatContactService.cancelContactRequest(event.data);
        break;
    }
  }

  getPrevMessage(currentMessage: any) {
    let curMsgIndex = _.findIndex(this.item.value.data, {
      id: currentMessage.id
    });
    return curMsgIndex <= 0 ? null : this.item.value.data[curMsgIndex - 1];
  }
}