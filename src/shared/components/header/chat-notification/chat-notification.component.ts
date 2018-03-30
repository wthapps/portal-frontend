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

@Component({
  selector: 'chat-notification',
  templateUrl: './chat-notification.component.html',
  styleUrls: ['./chat-notification.component.css']
})
export class ChatNotificationComponent implements OnInit, AfterViewInit {

  tooltip: any = Constants.tooltip;
  defaultAvatar: string = Constants.img.avatar;
  urls: any = Constants.baseUrls;
  conversations: any;
  notificationCount: any;

  constructor(private navigateService: WTHNavigateService,
              private apiBaseService: ApiBaseService,
              private router: Router,
              private storageService: StorageService,
              public connectionService: ConnectionNotificationService,
              public notificationService: NotificationService,
              public wthNavigateService: WTHNavigateService,
              public authService: AuthService) {
  }

  ngOnInit() {
    // if (this.authService.isAuthenticated()) {
    //   this.apiBaseService.addCommand(ConversationApiCommands.mostRecentConversations()).subscribe((res: any) => {
    //      this.conversations = res.data;
    //   });
    // }
  }

  ngAfterViewInit(): void {
    //
  }

  viewAllNotifications() {
    // Close mini notification dropdown box in the header
    $('.navbar-nav-notification').removeClass('open');

    // Navigate to notification page of social module
    if (this.navigateService.inSameModule([Constants.baseUrls.note, Constants.baseUrls.social, Constants.baseUrls.media, Constants.baseUrls.contact]))
      this.navigateService.navigateTo(['/notifications']);
    else
      this.navigateService.navigateOrRedirect('notifications', 'social');
  }

  toggleViewNotifications() {
    this.apiBaseService.addCommand(ConversationApiCommands.mostRecentConversations()).subscribe((res: any) => {
       this.conversations = res.data;
       this.notificationCount = this.totalNotificationCalculate();
    });
  }

  markAllAsRead() {
    this.apiBaseService.addCommand(ConversationApiCommands.markAllAsRead()).subscribe((res: any) => {
       this.conversations = this.conversations.map((conversation: any) => {
         conversation.group_user.notification_count = 0;
         return conversation;
       });
       this.notificationCount = this.totalNotificationCalculate();
    });

    this.updateChatStore('markAllAsRead');
  }

  markAsRead(c: any) {
    this.apiBaseService.addCommand(ConversationApiCommands.markAsRead({id: c.id})).subscribe((res: any) => {
       this.conversations = this.conversations.map((conversation: any) => {
         if (conversation.id == c.id) conversation.group_user.notification_count = 0;
         return conversation;
       });
       this.notificationCount = this.totalNotificationCalculate();
    });
  }

  updateNotification(c: any) {
    this.apiBaseService.addCommand(ConversationApiCommands.updateNotification({id: c.id, notification: false})).subscribe((res: any) => {
      console.log(res);
    });
  }

  updateChatStore(action: any, params: any = null) {
    console.log(this.storageService.find('chat_conversations'));
  }

  getMore() {
    // this.apiBaseService.addCommand(ConversationApiCommands.mostRecentConversations()).subscribe((res: any) => {
    //    // this.conversations = res.data;
    // });
  }

  private navigate(conversation: any) {
    $('#chat-header-notification').removeClass('open');
    this.wthNavigateService.navigateOrRedirect(`conversations/${conversation.group_user.id}`, 'chat');
  }


  private totalNotificationCalculate() {
    return this.conversations.reduce((acc, curr) => {
      acc += curr.group_user.notification_count;
      return acc;
    }, 0);
  }

  private subToggle(e: any) {
    e.stopPropagation();
    e.preventDefault();
    $(e.target).next('ul').toggle();
    $('#chat-header-notification').find('ul.dropdown-menu').not($(e.target).next('ul')).hide();
  }

  private hideActionsMenu(e: any) {
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
