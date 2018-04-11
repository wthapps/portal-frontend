import { Component, OnInit, ViewChild } from '@angular/core';
import { Constants } from '@shared/constant/config/constants';
import { ChatService } from '../services/chat.service';
import { ZChatToolbarComponent } from '../toolbar/toolbar.component';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { StorageService, UrlService, HandlerService } from '@shared/services';
import { Store } from '@ngrx/store';

declare var $: any;

@Component({
  selector: 'z-chat-share-sidebar',
  templateUrl: 'sidebar.component.html',
  styleUrls: ['sidebar.component.scss']
})
export class ZChatSidebarComponent implements OnInit {
  chatMenu = Constants.chatMenuItems;

  usersOnlineItem: any;
  favouriteContacts: any;
  historyContacts: any;
  recentContacts: any;
  historyShow: any = true;
  isRedirect: boolean;
  @ViewChild('chatToolbar') chatToolbar: ZChatToolbarComponent;

  constructor(
    public chatService: ChatService,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<any>,
    private handlerService: HandlerService,
    private urlService: UrlService,
    private storageService: StorageService
  ) {}

  ngOnInit() {
    // this.store.select('conversations').subscribe((state: any) => {
    //   console.log(state);
    // });
    // this.store.select('conversationsUsers').subscribe((state: any) => {
    //   console.log(state);
    // });

    this.router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe((event: any) => {
        if (this.urlService.parse().paths[0] === 'conversations') {
          if (this.urlService.parse().paths[1]) {
            this.chatService
              .getConversationsAsync()
              .take(1)
              .subscribe((res: any) => {
                if (res.value && res.value.data) {
                  res.value.data.forEach(contact => {
                    if (
                      contact.id === parseInt(this.urlService.parse().paths[1])
                    ) {
                      this.storageService.save('conversation_select', contact);
                      this.chatService.getMessages(contact.group_json.id);
                    }
                  });
                }
              });
          } else {
            this.chatService
              .getConversationsAsync()
              .take(1)
              .subscribe((res: any) => {
                if (res.value && res.value.data) {
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

    this.recentContacts = this.chatService.getRecentConversations();
    this.favouriteContacts = this.chatService.getFavouriteConversations();
    this.historyContacts = this.chatService.getHistoryConversations();
    this.usersOnlineItem = this.chatService.getUsersOnline();
  }

  onSelect(contact: any) {
    $('#chat-message-text').focus();
    this.chatService.selectContact(contact);
  }

  onAddContact() {
    this.chatToolbar.onAddContact();
  }

  historyToggle() {
    this.historyShow = !this.historyShow;
  }
}
