import {
  AfterViewInit,
  Component,
  EventEmitter,
  HostBinding, OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { take, filter, map, takeUntil } from 'rxjs/operators';

import { Constants } from '@shared/constant/config/constants';
import { ChatService } from '../services/chat.service';
import { NavigationEnd, Router } from '@angular/router';
import {
  ApiBaseService,
  StorageService,
  UrlService,
  CommonEventService,
  CommonEventHandler, AuthService
} from '@shared/services';
import { WTHEmojiService } from '@shared/components/emoji/emoji.service';
import { WTHEmojiCateCode } from '@shared/components/emoji/emoji';
import { TextBoxSearchComponent } from '@shared/partials/search-box';
import { ChatConversationService } from '../services/chat-conversation.service';
import { select, Store } from '@ngrx/store';
import {
  AppState,
  ConversationActions,
  ConversationSelectors
} from '@chat/store';
import { WebsocketService } from '@shared/channels/websocket.service';
import { ChannelEvents } from '@shared/channels';
import { ContactSelectionService } from '@chat/shared/selections/contact/contact-selection.service';
import { UserEventService } from '@shared/user/event';
import { NotificationEventService } from '@shared/services/notification';
import { MessageActions } from '@chat/store/message';


@Component({
  selector: 'z-chat-share-sidebar',
  templateUrl: 'sidebar.component.html',
  styleUrls: ['sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ZChatSidebarComponent extends CommonEventHandler implements OnInit, OnDestroy {
  @HostBinding('class') cssClass = 'menuleft-chat';
  @ViewChild('textbox') textbox: TextBoxSearchComponent;

  readonly chatMenu = Constants.chatMenuItems;

  usersOnlineItem$: Observable<any>;
  loading$: Observable<boolean>;
  loadingMore$: Observable<boolean>;
  loaded$: Observable<boolean>;
  conversations$: any;
  searchConversations$: Observable<any>;
  nextLink: string;
  nextLinkSearch: string;
  conversationId: string;

  destroy$ = new Subject();

  filter = 'All';
  emojiMap$: Observable<{ [name: string]: WTHEmojiCateCode }>;

  searching = false;
  searched = false;

  channel = 'CONVERSATION_ACTIONS';

  constructor(
    public chatService: ChatService,
    public chatConversationService: ChatConversationService,
    private router: Router,
    private store$: Store<AppState>,
    private renderer: Renderer2,
    public commonEventService: CommonEventService,
    private wthEmojiService: WTHEmojiService,
    private apiBaseService: ApiBaseService,
    private authService: AuthService,
    private websocketService: WebsocketService,
    private contactSelectionService: ContactSelectionService,
    private userEventService: UserEventService,
    private notificationEventService: NotificationEventService,
  ) {
    super(commonEventService);
    this.emojiMap$ = this.wthEmojiService.name2baseCodeMap$;
  }

  ngOnInit() {
    this.usersOnlineItem$ = this.chatService.getUsersOnline();
    this.loading$ = this.store$.pipe(select(ConversationSelectors.selectIsLoading));
    this.loadingMore$ = this.store$.pipe(select(ConversationSelectors.selectIsLoadingMore));
    this.loaded$ = this.store$.pipe(select(ConversationSelectors.selectLoaded));
    this.conversations$ = this.store$.pipe(select(ConversationSelectors.selectAllConversations));
    this.searchConversations$ = this.store$.pipe(select(ConversationSelectors.selectSearchedConversations));
    this.store$.pipe(select(ConversationSelectors.getLinks), takeUntil(this.destroy$)).subscribe(links => {
      this.nextLink = links.next;
    });
    this.store$.pipe(select(ConversationSelectors.getSearchedLinks), takeUntil(this.destroy$)).subscribe(links => {
      this.nextLinkSearch = links.next;
    });
    this.store$.pipe(
      select(ConversationSelectors.selectJoinedConversationId),
      filter(conversationId => conversationId != null),
      takeUntil(this.destroy$))
      .subscribe((conversationId: any) => {
        this.conversationId = conversationId;
        // this.store$.dispatch(new ConversationActions.SetState({joinedConversationId: conversationId}));
        console.log('conversationId:::', conversationId);
        this.redirectToConversationDetails(conversationId);
    });

    this.loadConversations();

    // handle adding members
    this.contactSelectionService.onSelect$.pipe(
      filter((event: any) => event.eventName === 'NEW_CHAT'),
      takeUntil(this.destroy$)
    ).subscribe((response: any) => {
      this.createConversation({users: response.payload.data});
    });

    // handle user channel events
    this.websocketService.userChannel.on(ChannelEvents.CHAT_CONVERSATION_CREATED, (response: any) => {
      const conversation = response.data.attributes;
      this.createConversationCallback(conversation);
    });

    this.websocketService.userChannel.on(ChannelEvents.CHAT_CONVERSATION_UPSERTED, (response: any) => {
      const conversation = response.data.attributes;
      this.upsertConversationCallback(conversation);
    });

    this.websocketService.userChannel.on(ChannelEvents.CHAT_CONVERSATION_UPDATED, (response: any) => {
      const conversation = response.data.attributes;
      this.updateConversationCallback(conversation);
    });

    // Handle user events
    this.userEventService.createChat$.pipe(takeUntil(this.destroy$)).subscribe(user => {
      this.createConversation({ users: [user] });
    });

    this.notificationEventService.markAsRead$.pipe(takeUntil(this.destroy$)).subscribe(conversation => {
      this.markAsReadCallBack(conversation);
    });

    this.notificationEventService.markAllAsRead$.pipe(takeUntil(this.destroy$)).subscribe(response => {
      this.markAllAsReadCallBack();
    });
  }

  /*
    Load conversations
   */
  loadConversations(query: any = {}) {
    this.store$.dispatch(new ConversationActions.GetItems({query: query}));
  }

  loadMoreConversations() {
    if (this.searching) {
      if (this.nextLinkSearch) {
        this.store$.dispatch(new ConversationActions.SearchMore({path: this.nextLinkSearch}));
      }
    } else {
      if (this.nextLink) {
        this.store$.dispatch(new ConversationActions.GetMoreItems({path: this.nextLink}));
      }
    }
  }

  doFilter(param) {
    let query = {};
    switch (param) {
      case 'all':
        this.filter = 'All';
        break;
      case 'unread':
        query = {unread: true};
        this.filter = 'Unread';
        break;
      case 'sent':
        query = {status: 'sent_request'};
        this.filter = 'Sent Request';
        break;
      case 'pending':
        query = {status: 'pending'};
        this.filter = 'Pending Request';
        break;
    }
    this.loadConversations(query);
  }

  selectConversation(conversation: any, event: any) {
    event.preventDefault();
    event.stopPropagation();
    $('#chat-message-text').focus();

    this.redirectToConversationDetails(conversation.uuid);
    this.notificationEventService.updateNotificationCount({count: conversation.notification_count, type: 'remove'});
  }

  createConversation(payload: any) {
    this.store$.dispatch(new ConversationActions.Create(payload));
  }

  createConversationCallback(conversation: any) {
    // console.log('CREATED CONVERSATION:::', conversation);
    this.store$.dispatch(new ConversationActions.UpsertSuccess({conversation: conversation}));
    // update cursor if current user is conversation owner
    if (this.authService.user.id === conversation.creator_id) {
      this.store$.dispatch(new MessageActions.SetState({ cursor: conversation.latest_message.cursor + 1}));
    }
    if (conversation.notification_count > 0) {
      this.notificationEventService.updateNotificationCount({count: conversation.notification_count, type: 'add'});
    }
  }

  upsertConversationCallback(conversation: any) {
    // console.log('UPSERTED CONVERSATION:::', conversation);
    // if currentUser is a member then add to conversation list
    this.store$.dispatch(new ConversationActions.UpsertSuccess({conversation: conversation}));

    // increase notification to 1 if having a new message
    // Just recalculate chat notification count for conversation is not current
    // if ((this.conversationId !== conversation.uuid) && (conversation.notification_count > 0)) {
    //   this.notificationEventService.updateNotificationCount({count: 1, type: 'add'});
    // }
  }

  updateConversationCallback(conversation: any) {
    console.log('UPDATED CONVERSATION:::', conversation);
    this.store$.dispatch(new ConversationActions.UpdateSuccess({conversation: conversation}));
  }

  openContactSelectionModal() {
    this.contactSelectionService.open({
      type: 'NEW_CHAT'
    });
  }

  openContactModal() {
    this.commonEventService.broadcast({
      channel: 'ContactListModalComponent',
      action: 'open',
      payload: { selectedTab: 'all' },
      from: 'ZChatSidebarComponents'
    });
  }

  redirectToConversationDetails(conversationId: string) {
    this.router.navigate(['conversations', conversationId]).then();
  }

  onCloseMenu() {
    this.renderer.removeClass(document.body, 'left-sidebar-open');
  }
  /*
  * Handle searching here
   */
  search(keyword: string) {
    if (keyword === '') {
      this.clearSearch({});
      return;
    }
    this.searching = true;
    this.searched = false;

    this.store$.dispatch(new ConversationActions.Search({
      q: keyword,
      sort: 'name'
    }));
    this.searched = true;
  }

  clearSearch(event: any) {
    this.searching = false;
    this.searched = false;
    this.textbox.search = '';
    this.store$.dispatch(new ConversationActions.ClearSearch());
  }
  /*
  * End of searching here
  */

  markAllAsRead() {
    this.notificationEventService.markAllAsRead();
  }

  markAsReadCallBack(conversation: any) {
    // Clear notification count on Top right
    // And current conversations' notification count as well
    this.store$.dispatch(new ConversationActions.MarkAsReadSuccess({conversation: conversation}));
  }

  markAllAsReadCallBack() {
    // Clear notification count on Top right and conversation list's notification count as well
    this.store$.dispatch(new ConversationActions.MarkAllAsRead({}));
  }

  trackById(index: number, conversation: any) {
    return conversation.uuid;
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}


