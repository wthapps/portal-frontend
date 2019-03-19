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
  OnDestroy, AfterViewInit
} from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { takeUntil, filter } from 'rxjs/operators';

import { ChatService } from '../services/chat.service';
import { ZChatShareRequestContactComponent } from '../modal/request-contact.component';
import { Router } from '@angular/router';
import { User } from '@wth/shared/shared/models';
import { WTHEmojiService } from '@shared/components/emoji/emoji.service';
import { Observable } from 'rxjs/Observable';
import { WTHEmojiCateCode } from '@shared/components/emoji/emoji';
import { ChatContactService } from '@chat/shared/services/chat-contact.service';
import { ChatConversationService } from '../services/chat-conversation.service';

import { Store, select } from '@ngrx/store';
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
export class MessageListComponent implements OnInit, OnDestroy {
  @ViewChild('request') requestModal: ZChatShareRequestContactComponent;
  @ViewChild('listEl') listEl: ElementRef;

  @Input() messages: any;
  @Input() conversation: any;
  @Input() currentUser: User;
  @Input() channel = 'MessageListComponent';

  emojiMap$: Observable<{[name: string]: WTHEmojiCateCode}>;
  loading$: Observable<boolean>;
  loadingMore$: Observable<boolean>;
  currentCursor: number;
  links: any;

  private destroy$ = new Subject();

  constructor(
    private chatService: ChatService,
    private router: Router,
    private store$: Store<AppState>,
    private chatContactService: ChatContactService,
    private chatConversationService: ChatConversationService,
    private wthEmojiService: WTHEmojiService
  ) {
    this.emojiMap$ = this.wthEmojiService.name2baseCodeMap$;
  }



  ngOnInit() {
    this.loading$ = this.store$.pipe(select(MessageSelectors.getLoading));
    this.loadingMore$ = this.store$.pipe(select(MessageSelectors.getLoadingMore));
    this.store$.pipe(
      select(MessageSelectors.getCurrentCursor),
      takeUntil(this.destroy$)
    ).subscribe(cursor => {
      if (cursor !== 0) {
        this.currentCursor = cursor;
      }
    });

    this.store$.pipe(
      select(MessageSelectors.getLinks),
      takeUntil(this.destroy$)
    ).subscribe(links => {
        this.links = links;
    });

    this.store$.pipe(
      select(MessageSelectors.getScrollable),
      filter(scrollable => scrollable === true),
      takeUntil(this.destroy$)
    ).subscribe(scrollable => {
      this.scrollToBottom(scrollable);
    });
  }


  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  scrollToBottom(scrollable: any) {
    if (scrollable && this.listEl) {
      setTimeout(() => {
        this.listEl.nativeElement.scrollTop = this.listEl.nativeElement.scrollHeight;
        this.store$.dispatch(new MessageActions.UpdateState({scrollable: false}));
      }, 200);
    }
  }

  loadMoreMessages() {
    if (this.links.next && this.links.next !== this.links.self) {
      this.store$.dispatch(new MessageActions.GetMore({path: this.links.next}));
    }
  }

  scrollDown() {
    // this.chatConversationService.getStoreSelectedConversation().pipe(take(1)).subscribe(res => {
    //   this.chatConversationService.markAsRead(res);
    // });
    // if ($('#chat-message-text').is(':focus')) {
    // }
  }

  onAddContact(contact: any) {
    // this.requestModal.contact = contact;
    // this.chatContactService.addContact([contact.id], '').then(res => {
    //   this.chatConversationService.updateStoreConversation(res.data);
    //   this.chatConversationService.navigateToConversation(res.data.group_id);
    // });
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
}
