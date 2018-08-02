import { Component, OnInit } from '@angular/core';
import { Constants, CHAT_CONVERSATIONS } from "@shared/constant";
import { AuthService } from '@wth/shared/services';
import { WTHNavigateService } from "@shared/services/wth-navigate.service";
import { Router } from "@angular/router";
import { ConnectionNotificationService } from "@shared/services/connection-notification.service";
import { NotificationService } from "@shared/services/notification.service";
import { ApiBaseService } from "@shared/services/apibase.service";
import { ConversationApiCommands } from "@shared/commands/chat/coversation-commands";
import { StorageService } from "@shared/services/storage.service";
import { HandlerService } from "@shared/services/handler.service";
import { Conversation } from '@chat/shared/models/conversation.model';

declare var $: any;

@Component({
  selector: 'chat-notification',
  templateUrl: './chat-notification.component.html',
  styleUrls: ['./chat-notification.component.css']
})
export class ChatNotificationComponent implements OnInit {

  readonly tooltip: any = Constants.tooltip;
  readonly defaultAvatar: string = Constants.img.avatar;
  readonly urls: any = Constants.baseUrls;
  conversations: any = [];
  notificationCount: number = 0;
  links: any;


  constructor(private navigateService: WTHNavigateService,
              private apiBaseService: ApiBaseService,
              private router: Router,
              private storageService: StorageService,
              public connectionService: ConnectionNotificationService,
              public notificationService: NotificationService,
              public handlerService: HandlerService,
              public wthNavigateService: WTHNavigateService,
              public authService: AuthService) {
  }

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.apiBaseService.addCommand(ConversationApiCommands.notificationsCount()).subscribe((res: any) => {
         this.notificationCount = res.data.count;
      });
    }
    this.handlerService.addListener('remove_notification_after_select_header', 'on_conversation_select', (contact: any) => {
      if (this.notificationCount > 0 &&  this.notificationCount - contact.notification_count > 0) {
        this.notificationCount -=  contact.notification_count;
      } else {
        this.notificationCount = 0;
      }
      this.conversations = this.conversations.map((conversation: any) => {
        if (conversation.id == contact.group_json.id) {
          conversation.notification_count = 0;
        }
        return conversation;
      });
    });
    this.handlerService.addListener('add_notification', 'on_notification_come', (res: any) => {
      this.notificationCount += res.count;
    });

    this.storageService.getAsync(CHAT_CONVERSATIONS).subscribe(res => {
      console.log('conversations: ', res);
      if(res && res.data) {
        this.conversations = res.data;
        this.notificationCount = this.conversations.reduce((acc, item) => (acc + item.notification_count), 0);
      }
    })
  }

  gotoChat() {
    this.navigateService.navigateOrRedirect('conversations', 'chat');
    $('#chat-header-notification').removeClass('open');
  }

  toggleViewNotifications() {
    this.apiBaseService.addCommand(ConversationApiCommands.mostRecentConversations()).subscribe((res: any) => {
      console.log(res);

      this.links = res.meta.links;
      this.conversations = res.data;
      // this.visibleConversations = this.conversations.filter(c => this.visibleConversationIds.includes(c.group_user.id));
    });
  }

  markAllAsRead() {
    this.apiBaseService.addCommand(ConversationApiCommands.markAllAsRead()).subscribe((res: any) => {
      this.notificationCount = 0;
      this.conversations = this.conversations.map((conversation: any) => {
         conversation.notification_count = 0;
         return conversation;
      });
      this.updateChatStore('markAllAsRead');
    });
  }

  markAsRead(c: Conversation) {
    const group_id = c.group_json.id;
    this.apiBaseService.addCommand(ConversationApiCommands.markAsRead({id: group_id})).subscribe((res: any) => {
      if (this.notificationCount > 0) {
        if (this.notificationCount - res.data.old > 0) {
          this.notificationCount -= res.data.old;
        } else {
          this.notificationCount = 0;
        }
      }
      this.conversations = this.conversations.map((conversation: any) => {
       if (conversation.id == group_id) {
         conversation.notification_count = 0;
       }
       return conversation;
      });
      this.updateChatStore('markAsRead', {id: group_id});
    });
  }

  updateNotification(c: Conversation) {
    const group_id = c.group_json.id;
    this.apiBaseService.addCommand(ConversationApiCommands.updateNotification({id: group_id, notification: !c.notification})).subscribe((res: any) => {
      c.notification = res.data.notification;
      this.updateChatStore('updateNotification', {id: group_id, notification: res.data.notification});
    });
  }

  updateChatStore(action: any, params: any = null) {
    const chat_conversations = this.storageService.find('chat_conversations');
    switch(action) {
      case 'markAllAsRead':
        if (chat_conversations && chat_conversations.value && chat_conversations.value.data) {
          const conversations = chat_conversations.value.data.map((conversation: any) => {
            conversation.notification_count = 0;
            return conversation;
          })
          chat_conversations.value.data = conversations;
        }
      break;
      case 'markAsRead':
        if (chat_conversations && chat_conversations.value && chat_conversations.value.data) {
          const conversations = chat_conversations.value.data.map((conversation: any) => {
            if (conversation.group_json.id == params.id) conversation.notification_count = 0;
            return conversation;
          })
          chat_conversations.value.data = conversations;
        }
      break;
      case 'updateNotification':
        if (chat_conversations && chat_conversations.value && chat_conversations.value.data) {
          const conversations = chat_conversations.value.data.map((conversation: any) => {
            if (conversation.group_json.id == params.id) conversation.notification = params.notification;
            return conversation;
          })
          chat_conversations.value.data = conversations;
        }
      break;
    }
  }

  getMore() {
    if(this.links && this.links.next) {
      this.apiBaseService.get(this.links.next).subscribe((res: any) => {
        this.conversations = [...this.conversations, ...res.data];
        this.links = res.meta.links;
      });
    }
  }

  private navigate(conversation: any) {
    $('#chat-header-notification').removeClass('open');
    this.wthNavigateService.navigateOrRedirect(`conversations/${conversation.id}`, 'chat');
  }

  private subToggle(e: any) {
    e.stopPropagation();
    e.preventDefault();
    $(e.target).next('ul').toggle();
    $('#chat-header-notification').find('ul.dropdown-menu').not($(e.target).next('ul')).hide();
  }

  hideActionsMenu(e: any) {
    e.stopPropagation();
    e.preventDefault();
    $('#chat-header-notification').find('ul.dropdown-menu').hide();
  }

  private parentHide(e: any) {
    e.stopPropagation();
    e.preventDefault();
    $(e.target).parent().parent().toggle();
  }
}
