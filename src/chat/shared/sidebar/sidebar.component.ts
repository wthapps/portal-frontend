import { Component, HostBinding, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';

import { Observable } from 'rxjs';
import { take, filter } from 'rxjs/operators';

import { Constants } from '@shared/constant/config/constants';
import { ChatService } from '../services/chat.service';
import { NavigationEnd, Router } from '@angular/router';
import { ApiBaseService, StorageService, UrlService, WMessageService, CommonEventService } from '@shared/services';
import { ZChatShareAddContactService } from '@chat/shared/modal/add-contact.service';
import { Conversation } from '@chat/shared/models/conversation.model';
import { WTHEmojiService } from '@shared/components/emoji/emoji.service';
import { WTHEmojiCateCode } from '@shared/components/emoji/emoji';
import { ModalService } from '@shared/components/modal/modal-service';
import { TextBoxSearchComponent } from '@shared/partials/search-box';
import { ContactListModalComponent } from '@chat/contact/contact-list-modal.component';
import { ChatConversationService } from '../services/chat-conversation.service';
import { Store } from '@ngrx/store';
import { STORE_CONVERSATIONS } from '@shared/constant';


@Component({
  selector: 'z-chat-share-sidebar',
  templateUrl: 'sidebar.component.html',
  styleUrls: ['sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ZChatSidebarComponent implements OnInit {
  @HostBinding('class') cssClass = 'menuleft-chat';
  @ViewChild('textbox') textbox: TextBoxSearchComponent;

  readonly chatMenu = Constants.chatMenuItems;

  usersOnlineItem$: Observable<any>;
  favouriteContacts$: Observable<any>;
  historyContacts$: Observable<any>;
  recentContacts$: Observable<any>;
  contactItem$: Observable<any>;
  conversations$: any;
  contactSelect$: Observable<any>;
  historyShow: any = true;
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
    private urlService: UrlService,
    private storageService: StorageService,
    private store: Store<any>,
    private renderer: Renderer2,
    private commonEventService: CommonEventService,
    private addContactService: ZChatShareAddContactService,
    private wthEmojiService: WTHEmojiService,
    private modalService: ModalService,
    private apiBaseService: ApiBaseService
  ) {
    this.emojiMap$ = this.wthEmojiService.name2baseCodeMap$;
  }

  ngOnInit() {
    // this.contactItem$ = this.chatService.getConversationsAsync();
    this.usersOnlineItem$ = this.chatService.getUsersOnline();
    this.contactSelect$ = this.chatService.getContactSelectAsync();
    this.conversations$ = this.store.select(STORE_CONVERSATIONS);
  }

  doFilter(param) {
    if (param === 'unread') {
      this.chatService.getConversationsAsync({ forceFromApi: true, url: 'zone/chat/contacts?filter[where][gt][notification_count]=0' })
        .subscribe((res: any) => {
          this.filter = 'Unread';
        });
    }
    if (param === 'all') {
      this.chatService.getConversationsAsync({ forceFromApi: true }).subscribe((res: any) => {
        this.filter = 'All';
      });
    }
    if (param === 'sent') {
      this.chatService.getConversationsAsync({ forceFromApi: true, url: 'zone/chat/contacts?filter[where][status]=sent_request' })
        .subscribe((res: any) => {
          this.filter = 'Sent Request';
        });
    }
    if (param === 'pending') {
      this.chatService.getConversationsAsync({ forceFromApi: true, url: 'zone/chat/contacts?filter[where][status]=pending' })
        .subscribe((res: any) => {
          this.filter = 'Pending Request';
        });
    }
  }

  onSelect(event: any, contact: any) {
    event.preventDefault();
    event.stopPropagation();
    $('#chat-message-text').focus();
    if (contact.deleted) {
      this.chatService.updateGroupUser(contact.group_id, { deleted: false }).then(res => {
        this.chatConversationService.apiGetConversations().then(r2 => {
          this.chatConversationService.navigateToConversation(contact.group_id);
        })
      });
    } else {
      this.chatConversationService.navigateToConversation(contact.group_id);
    }
  }

  onAddContact() {
    // this.addContactService.open('addContact');
    this.commonEventService.broadcast({
        channel: 'ZChatShareAddContactComponent',
        action: 'open',
        payload: {option: 'addChat'}
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

  onFavourite(conversation: any) {
    this.chatService.addGroupUserFavorite(conversation);
  }

  historyToggle() {
    this.historyShow = !this.historyShow;
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
