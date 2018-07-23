import { Component, OnInit, ViewChild, Renderer2 } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { Constants } from '@shared/constant/config/constants';
import { ChatService } from '../services/chat.service';
import { ZChatToolbarComponent } from '../toolbar/toolbar.component';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { StorageService, UrlService, HandlerService } from '@shared/services';
import { CONVERSATION_SELECT } from '@wth/shared/constant';
import { ZChatShareAddContactService } from '@chat/shared/modal/add-contact.service';

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
          if (this.urlService.parse().paths[1]) {
            this.chatService
              .getConversationsAsync()
              .subscribe((res: any) => {
                if (res.value && res.value.data) {
                  res.value.data.forEach(contact => {
                    if (
                      contact.id === parseInt(this.urlService.parse().paths[1])
                    ) {
                      this.storageService.save(CONVERSATION_SELECT, contact);
                      this.chatService.getMessages(contact.group_json.id);
                    }
                  });
                }
              });
          } else {
            this.chatService
              .getConversationsAsync()
              .toPromise()
              .then((res: any) => {
                if (res.value && res.value.data && res.value.data[0]) {
                  this.chatService.router.navigate([
                    `${this.chatService.constant.conversationUrl}/${
                      res.value.data[0].id
                      }`
                  ]);
                  this.chatService.selectContact(res.value.data[0]);
                  this.chatService.getMessages(res.value.data[0].group_json.id);
                }
              });
          }
        }
      });

    this.recentContacts$ = this.chatService.getRecentConversations();
    this.favouriteContacts$ = this.chatService.getFavouriteConversations();
    this.historyContacts$ = this.chatService.getHistoryConversations();
    this.usersOnlineItem$ = this.chatService.getUsersOnline();
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
