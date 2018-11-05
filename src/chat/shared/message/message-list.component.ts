import { StorageService } from './../../../shared/services/storage.service';
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
  ElementRef,
  OnDestroy
} from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';

import { ChatService } from '../services/chat.service';
import { ZChatShareRequestContactComponent } from '../modal/request-contact.component';
import { WMessageService } from '@wth/shared/services';
import { Router } from '@angular/router';
import { User } from '@wth/shared/shared/models';
import { WTHEmojiService } from '@shared/components/emoji/emoji.service';
import { Observable } from 'rxjs/Observable';
import { WTHEmojiCateCode } from '@shared/components/emoji/emoji';
import { INCOMING_MESSAGE, ACTION } from '@shared/constant';
import { ChatContactService } from '@chat/shared/services/chat-contact.service';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';

declare var _: any;
declare var $: any;

@Component({
  selector: 'message-list',
  templateUrl: 'message-list.component.html',
  styleUrls: ['message-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MessageListComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('request') requestModal: ZChatShareRequestContactComponent;
  @ViewChild('listEl') listEl: ElementRef;

  @Input() currentMessages: any;
  @Input() contactItem: any;
  @Input() currentUser: User;
  emojiMap$: Observable<{[name: string]: WTHEmojiCateCode}>;
  prevMessage: any;
  readonly scrollDistance: number = 1000;
  // currentMessages: any[] = [];

  private destroySubject: Subject<any> = new Subject();

  constructor(
    private chatService: ChatService,
    private router: Router,
    private messageService: WMessageService,
    private storageService: StorageService,
    private chatContactService: ChatContactService,
    private wthEmojiService: WTHEmojiService
  ) {
    this.messageService.scrollToBottom$
      .pipe(
        takeUntil(this.destroySubject)
      )
      .subscribe((res: boolean) => {
      if (res && this.listEl) {
        this.listEl.nativeElement.scrollTop = this.listEl.nativeElement.scrollHeight;
      }
    });

    this.emojiMap$ = this.wthEmojiService.name2baseCodeMap$;
  }

  ngOnDestroy() {
    this.destroySubject.next('');
    this.destroySubject.complete();
  }
  ngOnInit() {
    // setInterval(() => {
    //   this.item = this.chatService.getCurrentMessages();
    //   this.contactItem = this.chatService.getContactSelect();
    //   this.ref.markForCheck();
    // }, 200);
  }

  ngOnChanges() {
    // console.log(this.currentMessages);
  }


  onLoadMore() {
    // console.log('onLoadMore ...', this.listEl.nativeElement.scrollTop);
    this.chatService.loadMoreMessages().then(res => {
      // if (res.data && res.data.length > 0)
      //   this.listEl.nativeElement.scrollTop += 100;
      this.currentMessages.unshift(...res.data);
    });
  }

  scrollDown() {
    if ($('#chat-message-text').is(':focus')) {
      this.chatService.markAsRead(this.contactItem.value.group_id);
    }
  }

  onAddContact(contact: any) {
    this.requestModal.contact = contact;
    // this.requestModal.modal.open();
    this.chatContactService.addContact([contact.id], '', (res) => {
      this.chatService.selectContactByPartnerId(contact.id);
    });
  }

  doEvent(event: any) {
    switch (event.action) {
      case 'CONTACT_REQUEST_CREATE':
        this.requestModal.contact = event.data.receiver;
        this.requestModal.modal.open();
        break;
      case 'CONTACT_REQUEST_CANCEL':
        this.chatService.chatContactService
          .cancelContactRequest(event.data)
          .then(conversationId => {
            const id = conversationId ? conversationId : '';
            this.router.navigate(['/conversations', id]);
          });
        break;
    }
  }

  getPrevMessage(currentMessage: any) {
    const curMsgIndex = _.findIndex(this.currentMessages, {
      id: currentMessage.id
    });
    return curMsgIndex <= 0 ? null : this.currentMessages[curMsgIndex - 1];
  }
}
