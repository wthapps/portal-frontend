import {
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
  WMessageService,
  CommonEventService,
  CommonEventHandler, AuthService
} from '@shared/services';
import { WTHEmojiService } from '@shared/components/emoji/emoji.service';
import { WTHEmojiCateCode } from '@shared/components/emoji/emoji';
import { TextBoxSearchComponent } from '@shared/partials/search-box';
import { ChatConversationService } from '../services/chat-conversation.service';
import { select, Store } from '@ngrx/store';
import { Conversations } from '@shared/shared/models/chat/conversations.model';
import {
  AppState,
  ConversationActions,
  ConversationSelectors
} from '@chat/store';
import { WebsocketService } from '@shared/channels/websocket.service';
import { ChannelEvents } from '@shared/channels';


@Component({
  selector: 'z-chat-share-sidebar',
  templateUrl: 'sidebar.component.html',
  styleUrls: ['sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ZChatSidebarComponent extends CommonEventHandler implements OnInit, OnDestroy {
  @HostBinding('class') cssClass = 'menuleft-chat';
  @ViewChild('textbox') textbox: TextBoxSearchComponent;
  @Output() onSelectedConversation = new EventEmitter<any>();

  readonly chatMenu = Constants.chatMenuItems;

  usersOnlineItem$: Observable<any>;
  favouriteContacts$: Observable<any>;
  historyContacts$: Observable<any>;
  recentContacts$: Observable<any>;
  contactItem$: Observable<any>;
  conversations$: any;
  searchConversations$: Observable<any>;
  links$: Observable<any>;
  links: any;

  destroy$ = new Subject();

  isRedirect: boolean;
  filter = 'All';
  emojiMap$: Observable<{ [name: string]: WTHEmojiCateCode }>;

  searching = false;

  searched = false;

  channel = 'CONVERSATION_ACTIONS';
  userChannel: any;

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
    private websocketService: WebsocketService
  ) {
    super(commonEventService);
    this.emojiMap$ = this.wthEmojiService.name2baseCodeMap$;
  }

  ngOnInit() {
    this.usersOnlineItem$ = this.chatService.getUsersOnline();
    this.conversations$ = this.store$.pipe(select(ConversationSelectors.selectAllConversations));
    this.searchConversations$ = this.store$.pipe(select(ConversationSelectors.selectSearchedConversations));
    this.store$.pipe(
      select(ConversationSelectors.getLinks),
      takeUntil(this.destroy$)
    ).subscribe(links => {
      this.links = links;
    });

    this.loadConversations({per_page: 7});

    // Init user channel
    // Create new channel depends on selected conversation
    // If channel has already been existing don't create new one
    this.userChannel = this.websocketService.subscribeChannel(`user:${this.authService.user.uuid}`, {token: this.authService.user.uuid});
    this.userChannel.join({token: 'test token'})
        .receive('ok', ({userInfo}) => {
          console.log('JOINED USER CHANNEL', userInfo);
          // Perform some tasks need to do after joining channel successfully
          // this.store$.dispatch(new ConversationActions.Create(conversationId));
        })
        .receive('error', ({reason}) => console.log('failed join', reason) )
        .receive('timeout', () => console.log('Networking issue. Still waiting...'));

    this.userChannel.on('create_conversation_success', (conversation: any) => {
        conversation['id'] = +(new Date());
        console.log('CONVERSATION CREATED SUCCESSFUL:::', conversation);
        this.store$.dispatch(new ConversationActions.CreateSuccess({conversation: conversation}));
      });

    this.userChannel.on(ChannelEvents.CHAT_CONVERSATION_CREATED, (response: any) => {
      const conversation = response.data.attributes;
      this.createConversationCallback(conversation);
    });
  }

  /*
    Load conversations
   */
  loadConversations(query: any = {}) {
    this.store$.dispatch(new ConversationActions.GetItems({query: query}));
  }

  loadMoreConversations(links: any) {
    if (links && links.next) {
      this.store$.dispatch(new ConversationActions.GetItems({path: links.next}));
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
    // if (contact.deleted) {
    //   this.chatConversationService.apiUpdateGroupUser(contact.group_id, { deleted: false, notification_count: 0 }).then(res => {
    //     this.chatConversationService.apiGetConversations().then(r2 => {
    //       this.chatConversationService.navigateToConversation(contact.group_id);
    //     })
    //   });
    // } else {
    //   const last = contact.notification_count;
    //   this.chatConversationService.apiUpdateGroupUser(contact.group_id, { notification_count: 0 }).then(res => {
    //     this.commonEventService.broadcast({
    //       channel: 'ChatNotificationComponent',
    //       action: 'addNotificationEvent',
    //       payload: { notification_count: 0, last_notification_count: last }
    //     });
    //     this.chatConversationService.navigateToConversation(contact.group_id);
    //   })
    // }
    // this.commonEventService.broadcast({
    //   channel: 'MessageEditorComponent',
    //   action: 'resetEditor'
    // })
    // this.store$.dispatch(new ConversationActions.SetSelectedItem(conversation));

    this.router.navigate(['conversations', conversation.uuid]).then();
    // this.onSelectedConversation.emit(conversation);
  }

  createConversation(payload: any) {

    this.store$.dispatch(new ConversationActions.Create(payload));

    // this.userChannel.push('CHAT_CONVERSATION_CREATED', payload)
    //   .receive('ok', (conversation: any) => {
    //   })
    //   .receive('error', (reasons) => console.log('create failed', reasons) )
    //   .receive('timeout', () => console.log('Networking issue...') );
  }

  createConversationCallback(conversation: any) {
    // if currentUser is owner then redirect to that conversation and join
    console.log('CREATED CONVERSATION:::', conversation);
    // if currentUser is a member then add to conversation list
    this.store$.dispatch(new ConversationActions.CreateSuccess({conversation: conversation}));

    if (this.authService.user.id === conversation.creator_id) {
      // Redirect to created conversation
      this.router.navigate(['/conversations', conversation.uuid]).then();
    }
  }

  onAddContact() {
    // this.commonEventService.broadcast({
    //     channel: 'ZChatShareAddContactComponent',
    //     action: 'open',
    //     payload: {option: 'addChat'}
    // });
  }

  openContactModal() {
    this.commonEventService.broadcast({
      channel: 'ContactListModalComponent',
      action: 'open',
      payload: { selectedTab: 'all' },
      from: 'ZChatSidebarComponents'
    });
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

  markAllAsRead() {
    this.conversations$.pipe(take(1)).subscribe(res => {
      this.commonEventService.broadcast({
        channel: 'ChatNotificationComponent',
        action: 'markAllAsReadEvent',
        payload: res
      })
    })
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}


