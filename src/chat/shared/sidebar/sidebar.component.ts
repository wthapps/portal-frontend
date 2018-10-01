import { Component, HostBinding, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { Constants } from '@shared/constant/config/constants';
import { ChatService } from '../services/chat.service';
import { NavigationEnd, Router } from '@angular/router';
import { ApiBaseService, StorageService, UrlService, WMessageService } from '@shared/services';
import { CONVERSATION_SELECT } from '@wth/shared/constant';
import { ZChatShareAddContactService } from '@chat/shared/modal/add-contact.service';
import { Conversation } from '@chat/shared/models/conversation.model';
import { WTHEmojiService } from '@shared/components/emoji/emoji.service';
import { WTHEmojiCateCode } from '@shared/components/emoji/emoji';
import { ModalService } from '@shared/components/modal/modal-service';
import { TextBoxSearchComponent } from '@shared/partials/search-box';


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
  historyShow: any = true;
  isRedirect: boolean;
  filter = 'All';
  emojiMap$: Observable<{[name: string]: WTHEmojiCateCode}>;

  searching = false;
  searchConversations: Array<any> = [];
  searched = false;

  constructor(
    public chatService: ChatService,
    private router: Router,
    private urlService: UrlService,
    private storageService: StorageService,
    private renderer: Renderer2,
    private addContactService: ZChatShareAddContactService,
    private wthEmojiService: WTHEmojiService,
    private modalService: ModalService,
    private apiBaseService: ApiBaseService
  ) {
    this.emojiMap$ = this.wthEmojiService.name2baseCodeMap$;
  }

  ngOnInit() {
    this.router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe((event: any) => {
        if (this.urlService.parse().paths[0] === 'conversations') {
          const conversationId = this.urlService.parse().paths[1];
          this.chatService
            .getConversationsAsync()
            .subscribe((res: any) => {
              if (!(res && res.value && res.value.data)) {
                return;
              }
              const conversations = res.value.data;
              const mostRecent = conversations[0];

              if (!Number.isInteger(+conversationId))
                return;
              if (conversationId) {
                let validConversation = false;
                conversations.forEach(contact => {
                  if (
                    contact.id === +conversationId
                  ) {
                    this.selectConversation(contact);
                    validConversation = true;
                    return;
                  }
                });

                if (!validConversation && mostRecent) {
                  this.selectConversation(mostRecent);
                }
              } else {
                if (mostRecent) {
                  this.selectConversation(mostRecent);
                }
              }
            });
        }
      });

    this.recentContacts$ = this.chatService.getRecentConversations();
    this.favouriteContacts$ = this.chatService.getFavouriteConversations();
    this.historyContacts$ = this.chatService.getHistoryConversations();
    this.usersOnlineItem$ = this.chatService.getUsersOnline();
  }

  selectConversation(conversation: Conversation) {
    this.chatService.router.navigate([
      `${this.chatService.constant.conversationUrl}/${
        conversation.id
        }`
    ]);
    this.storageService.save(CONVERSATION_SELECT, conversation);
    this.chatService.selectContact(conversation);
    this.chatService.getMessages(conversation.group_json.id);
  }

  doFilter(param) {
    if (param === 'unread') {
      this.chatService.getConversationsAsync({ forceFromApi: true, url: 'zone/chat/contacts?filter[where][gt][notification_count]=0'})
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
      this.chatService.getConversationsAsync({ forceFromApi: true, url: 'zone/chat/contacts?filter[where][status]=sent_request'})
      .subscribe((res: any) => {
        this.filter = 'Sent Request';
      });
    }
    if (param === 'pending') {
      this.chatService.getConversationsAsync({ forceFromApi: true, url: 'zone/chat/contacts?filter[where][status]=pending'})
      .subscribe((res: any) => {
        this.filter = 'Pending Request';
      });
    }
  }

  onSelect(contact: any) {
    $('#chat-message-text').focus();
    this.chatService.selectContact(contact);
    if (this.searching) {
      this.searching = false;
      this.textbox.search = '';
    }
  }

  onAddContact() {
    this.addContactService.open('addContact');
  }

  openContactModal() {
    this.modalService.open({selectedTab: 'all'});
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
    this.searching = true;
    this.searched = false;
    this.apiBaseService.get('zone/chat/search', {q: keyword}).subscribe((res: any) => {
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
