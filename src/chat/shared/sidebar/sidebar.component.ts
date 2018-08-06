import { Component, OnInit, Renderer2 } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { Constants } from '@shared/constant/config/constants';
import { ChatService } from '../services/chat.service';
import { NavigationEnd, Router } from '@angular/router';
import { StorageService, UrlService } from '@shared/services';
import { CONVERSATION_SELECT } from '@wth/shared/constant';
import { ZChatShareAddContactService } from '@chat/shared/modal/add-contact.service';
import { Conversation } from '@chat/shared/models/conversation.model';

declare var $: any;

@Component({
  selector: 'z-chat-share-sidebar',
  templateUrl: 'sidebar.component.html',
  styleUrls: ['sidebar.component.scss']
})
export class ZChatSidebarComponent implements OnInit {
  readonly chatMenu = Constants.chatMenuItems;

  usersOnlineItem$: Observable<any>;
  favouriteContacts$: Observable<any>;
  historyContacts$: Observable<any>;
  recentContacts$: Observable<any>;
  historyShow: any = true;
  isRedirect: boolean;

  constructor(
    public chatService: ChatService,
    private router: Router,
    private urlService: UrlService,
    private storageService: StorageService,
    private renderer: Renderer2,
    private addContactService: ZChatShareAddContactService
  ) {
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

  onSelect(contact: any) {
    $('#chat-message-text').focus();
    this.chatService.selectContact(contact);
  }

  onAddContact() {
    this.addContactService.open('addContact');
  }

  historyToggle() {
    this.historyShow = !this.historyShow;
  }

  onCloseMenu() {
    this.renderer.removeClass(document.body, 'left-sidebar-open');
  }
}
