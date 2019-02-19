import {
  Component,
  EventEmitter,
  HostBinding,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

import { Observable } from 'rxjs';
import { take, filter, map } from 'rxjs/operators';

import { Constants } from '@shared/constant/config/constants';
import { ChatService } from '../services/chat.service';
import { NavigationEnd, Router } from '@angular/router';
import { ApiBaseService, StorageService, UrlService, WMessageService, CommonEventService } from '@shared/services';
import { WTHEmojiService } from '@shared/components/emoji/emoji.service';
import { WTHEmojiCateCode } from '@shared/components/emoji/emoji';
import { TextBoxSearchComponent } from '@shared/partials/search-box';
import { ChatConversationService } from '../services/chat-conversation.service';
import { select, Store } from '@ngrx/store';
import { STORE_CONVERSATIONS } from '@shared/constant';
import { Conversations } from '@shared/shared/models/chat/conversations.model';
import {
  AppState,
  ConversationActions,
  ConversationSelectors
} from '@chat/store';


@Component({
  selector: 'z-chat-share-sidebar',
  templateUrl: 'sidebar.component.html',
  styleUrls: ['sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ZChatSidebarComponent implements OnInit {
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
  contactSelect$: Observable<any>;
  links$: Observable<any>;
  links: any;


  isRedirect: boolean;
  filter = 'All';
  emojiMap$: Observable<{ [name: string]: WTHEmojiCateCode }>;

  searching = false;
  searchConversations: Array<any> = [];
  searched = false;

  constructor(
    public chatService: ChatService,
    public chatConversationService: ChatConversationService,
    private router: Router,
    private store$: Store<AppState>,
    private renderer: Renderer2,
    private commonEventService: CommonEventService,
    private wthEmojiService: WTHEmojiService,
    private apiBaseService: ApiBaseService
  ) {
    this.emojiMap$ = this.wthEmojiService.name2baseCodeMap$;
  }

  ngOnInit() {
    this.usersOnlineItem$ = this.chatService.getUsersOnline();
    this.contactSelect$ = this.chatService.getContactSelectAsync();
    this.conversations$ = this.store$.select(ConversationSelectors.selectAllConversations).pipe();
    this.store$.pipe(select(ConversationSelectors.getLinks)).subscribe(links => {
      this.links = links;
    });

    this.loadConversations();
  }

  /*
    Load conversations
   */
  loadConversations() {
    this.store$.dispatch(new ConversationActions.GetAll({query: null}));
  }

  loadMoreConversations(links: any) {
    console.log('LOAD MORE CONVERSATION', links);
    if (links && links.next) {
      const query = links.next.split('?')[1];
      this.store$.dispatch(new ConversationActions.GetAll({query: query}));
    }

  }

  doFilter(param) {
    if (param === 'unread') {
      this.chatConversationService.apiGetConversations({ 'filter[where][gt][notification_count]': 0 })
        .then((res: any) => {
          this.filter = 'Unread';
        });
    }
    if (param === 'all') {
      this.chatConversationService.apiGetConversations().then((res: any) => {
        this.filter = 'All';
      });
    }
    if (param === 'sent') {
      this.chatConversationService.apiGetConversations({ 'filter[where][status]': 'sent_request' })
        .then((res: any) => {
          this.filter = 'Sent Request';
        });
    }
    if (param === 'pending') {
      this.chatConversationService.apiGetConversations({ 'filter[where][status]': 'pending' })
        .then((res: any) => {
          this.filter = 'Pending Request';
        });
    }
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

  onAddContact() {
    this.commonEventService.broadcast({
      channel: 'ZChatShareAddContactComponent',
      action: 'open',
      payload: { option: 'addChat' }
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
    this.apiBaseService.get('zone/chat/search', { q: keyword }).subscribe((res: any) => {
      this.searchConversations = res.data;
      this.searched = true;
    });
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
    this.searchConversations = [];
    this.textbox.search = '';
  }
  /*
  * End of searching here
   */
}
