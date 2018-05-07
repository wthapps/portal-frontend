import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { Constants } from "@shared/constant";
import { User } from "@shared/shared/models";
import { AuthService } from '@wth/shared/services';
import { WTHNavigateService } from "@shared/services/wth-navigate.service";
import { ChannelService } from "@shared/channels/channel.service";
import { Router } from "@angular/router";
import { ConnectionNotificationService } from "@shared/services/connection-notification.service";
import { NotificationService } from "@shared/services/notification.service";
import { NotificationListComponent } from "@shared/shared/components/notification-list/notification-list.component";
import { ApiBaseService } from "@shared/services/apibase.service";
import { ApiProxyService } from "@shared/services/apiproxy.service";
import { ConversationApiCommands } from "@shared/commands/chat/coversation-commands";
import { StorageService } from "@shared/services/storage.service";
import { HandlerService } from "@shared/services/handler.service";

declare var $: any;

@Component({
  selector: 'chat-notification',
  templateUrl: './chat-notification.component.html',
  styleUrls: ['./chat-notification.component.css']
})
export class ChatNotificationComponent implements OnInit {

  tooltip: any = Constants.tooltip;
  defaultAvatar: string = Constants.img.avatar;
  urls: any = Constants.baseUrls;
  conversations: any = [];
  notificationCount: any;
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
          conversation.group_user.notification_count = 0;
        }
        return conversation;
      });
    });
    this.handlerService.addListener('add_notification', 'on_notification_come', (res: any) => {
      this.notificationCount += res.count;
    });
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
    });
  }

  markAllAsRead() {
    this.apiBaseService.addCommand(ConversationApiCommands.markAllAsRead()).subscribe((res: any) => {
      this.notificationCount = 0;
      this.conversations = this.conversations.map((conversation: any) => {
         conversation.group_user.notification_count = 0;
         return conversation;
      });
      this.updateChatStore('markAllAsRead');
    });
  }

  markAsRead(c: any) {
    this.apiBaseService.addCommand(ConversationApiCommands.markAsRead({id: c.id})).subscribe((res: any) => {
      if (this.notificationCount > 0) {
        if (this.notificationCount - res.data.old > 0) {
          this.notificationCount -= res.data.old;
        } else {
          this.notificationCount = 0;
        }
      }
      this.conversations = this.conversations.map((conversation: any) => {
       if (conversation.id == c.id) {
         conversation.group_user.notification_count = 0;
       }
       return conversation;
      });
      this.updateChatStore('markAsRead', {id: c.id});
    });
  }

  updateNotification(c: any) {
    this.apiBaseService.addCommand(ConversationApiCommands.updateNotification({id: c.id, notification: !c.group_user.notification})).subscribe((res: any) => {
      c.group_user.notification = res.data.group_user.notification;
      this.updateChatStore('updateNotification', {id: c.id, notification: res.data.group_user.notification});
    });
  }

  updateChatStore(action: any, params: any = null) {
    switch(action) {
      case 'markAllAsRead':
        if (this.storageService.find('chat_conversations') && this.storageService.find('chat_conversations').value && this.storageService.find('chat_conversations').value.data) {
          const conversations = this.storageService.find('chat_conversations').value.data.map((conversation: any) => {
            conversation.notification_count = 0;
            return conversation;
          })
          this.storageService.find('chat_conversations').value.data = conversations;
        }
      break;
      case 'markAsRead':
        if (this.storageService.find('chat_conversations') && this.storageService.find('chat_conversations').value && this.storageService.find('chat_conversations').value.data) {
          const conversations = this.storageService.find('chat_conversations').value.data.map((conversation: any) => {
            if (conversation.group_json.id == params.id) conversation.notification_count = 0;
            return conversation;
          })
          this.storageService.find('chat_conversations').value.data = conversations;
        }
      break;
      case 'updateNotification':
        if (this.storageService.find('chat_conversations') && this.storageService.find('chat_conversations').value && this.storageService.find('chat_conversations').value.data) {
          const conversations = this.storageService.find('chat_conversations').value.data.map((conversation: any) => {
            if (conversation.group_json.id == params.id) conversation.notification = params.notification;
            return conversation;
          })
          this.storageService.find('chat_conversations').value.data = conversations;
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
    this.wthNavigateService.navigateOrRedirect(`conversations/${conversation.group_user.id}`, 'chat');
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
