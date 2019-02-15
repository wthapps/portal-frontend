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
import { takeUntil, take } from 'rxjs/operators';

import { ChatService } from '../services/chat.service';
import { ZChatShareRequestContactComponent } from '../modal/request-contact.component';
import { WMessageService, CommonEventHandler, CommonEventService, CommonEvent } from '@wth/shared/services';
import { Router } from '@angular/router';
import { User } from '@wth/shared/shared/models';
import { WTHEmojiService } from '@shared/components/emoji/emoji.service';
import { Observable } from 'rxjs/Observable';
import { WTHEmojiCateCode } from '@shared/components/emoji/emoji';
import { ChatContactService } from '@chat/shared/services/chat-contact.service';
import { ChatMessageService } from '../services/chat-message.service';
import { ChatConversationService } from '../services/chat-conversation.service';

import { Store } from '@ngrx/store';
import { AppState } from '@chat/store';
import { MessageActions, MessageSelectors } from '@chat/store/message';


declare var _: any;
declare var $: any;

@Component({
  selector: 'message-list',
  templateUrl: 'message-list.component.html',
  styleUrls: ['message-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MessageListComponent extends CommonEventHandler implements OnInit, OnDestroy {
  @ViewChild('request') requestModal: ZChatShareRequestContactComponent;
  @ViewChild('listEl') listEl: ElementRef;

  @Input() messages: any;
  @Input() conversation: any;
  @Input() currentUser: User;
  @Input() channel = 'MessageListComponent';
  @Input() selectedConversation;
  emojiMap$: Observable<{[name: string]: WTHEmojiCateCode}>;
  prevMessage: any;
  loading$: Observable<boolean>;
  loadingMore = false;
  currentCursor$: Observable<number>;
  currentCursor = 1536829920761;
  // currentMessages: any[] = [];

  private destroySubject: Subject<any> = new Subject();

  constructor(
    private chatService: ChatService,
    private router: Router,
    private store$: Store<AppState>,
    private messageService: WMessageService,
    private storageService: StorageService,
    public commonEventService: CommonEventService,
    private chatContactService: ChatContactService,
    private chatConversationService: ChatConversationService,
    private chatMessageService: ChatMessageService,
    private wthEmojiService: WTHEmojiService
  ) {
    // this.messageService.scrollToBottom$
    //   .pipe(
    //     takeUntil(this.destroySubject)
    //   )
    //   .subscribe((res: boolean) => {
    //   if (res && this.listEl) {
    //     this.listEl.nativeElement.scrollTop = this.listEl.nativeElement.scrollHeight;
    //   }
    // });
    super(commonEventService);
    this.emojiMap$ = this.wthEmojiService.name2baseCodeMap$;
  }

  // ngOnDestroy() {
  //   this.destroySubject.next('');
  //   this.destroySubject.complete();
  // }

  ngOnInit() {
    // setInterval(() => {
      //   this.item = this.chatService.getCurrentMessages();
      //   this.contactItem = this.chatService.getContactSelect();
      //   this.ref.markForCheck();
      // }, 200);

    this.loading$ = this.store$.select(MessageSelectors.getLoading);
    this.currentCursor$ = this.store$.select(MessageSelectors.getCurrentCursor);
    this.currentCursor$.subscribe(cursor => {
      if (cursor !== 0) {
        this.currentCursor = cursor;
      }
    });
  }

  scrollToBottom(event: CommonEvent) {
    if (event && this.listEl) {
      this.listEl.nativeElement.scrollTop = this.listEl.nativeElement.scrollHeight;
    }
  }

  onLoadMore() {
    this.loadingMore = true;
    // this.chatMessageService.loadMoreMessages();

    // this.store$.select(MessageSelectors.getLinks).subscribe(links => {
    //   console.log('get links:::', links);
      // if (links.next && links.next !== links.self) {
        this.store$.dispatch(new MessageActions.GetMore({groupId: this.conversation.uuid, queryParams: {cursor: this.currentCursor}}));

      // }
    // });
    this.loadingMore = false;
  }

  scrollDown() {
    // this.chatConversationService.getStoreSelectedConversation().pipe(take(1)).subscribe(res => {
    //   this.chatConversationService.markAsRead(res);
    // });
    // if ($('#chat-message-text').is(':focus')) {
    // }
  }

  onAddContact(contact: any) {
    this.requestModal.contact = contact;
    this.chatContactService.addContact([contact.id], '').then(res => {
      this.chatConversationService.updateStoreConversation(res.data);
      this.chatConversationService.navigateToConversation(res.data.group_id);
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
    const curMsgIndex = _.findIndex(this.messages, {
      id: currentMessage.id
    });
    return curMsgIndex <= 0 ? null : this.messages[curMsgIndex - 1];
  }
}
