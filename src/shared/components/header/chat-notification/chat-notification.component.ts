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
              public connectionService: ConnectionNotificationService,
              public notificationService: NotificationService,
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
       this.notificationCount = this.conversations.reduce((acc, curr) => {
         acc += curr.group_user.notification_count;
         return acc;
       }, 0)
    });
  }

  subToggle(e: any) {
    e.stopPropagation();
    e.preventDefault();
    $(e.target).next('ul').toggle();
    $('ul.dropdown-menu').not($(e.target).next('ul')).hide();
  }

  markAllAsRead() {
    // this.apiBaseService.addCommand(ConversationApiCommands.markAllAsRead()).subscribe((res: any) => {
    //    // this.conversations = res.data;
    // });
  }

  getMore() {
    // this.apiBaseService.addCommand(ConversationApiCommands.mostRecentConversations()).subscribe((res: any) => {
    //    // this.conversations = res.data;
    // });
  }
}
