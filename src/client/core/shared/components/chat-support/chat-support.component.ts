import {
  Component, OnInit, ViewChild,
  ComponentFactoryResolver,
  AfterViewInit
} from '@angular/core';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

import { CookieService, CookieOptions } from 'ngx-cookie';

import { ConversationListComponent } from './conversation/conversation-list.component';
import { ConversationEditComponent } from './conversation/conversation-edit.component';
import { ConversationCreateComponent } from './conversation/conversation-create.component';

import { ChatSupportBaseComponent } from './chat-support-base.component';
import { ChatSupportDirective } from './chat-support.directive';



import { AppearanceChannel } from './shared/channel/appearance.channel';
import { ChatSupportChannel } from './shared/channel/chat-support.channel';
import { NotificationChannel } from './shared/channel/notification.channel';
import { ApiBaseService } from '../../services/apibase.service';
import { Constants } from '../../config/constants';

const ChatSupportView = {
  list: 'list',
  detail: 'detail',
  userInfo: 'userInfo'
};

const ChatSupportAction = {
  createConversation: 'createConversation',
  goBack: 'goBack',
  goToDetail: 'goToDetail'
};

@Component({
  moduleId: module.id,
  selector: 'wth-chat-support',
  templateUrl: 'chat-support.component.html',
  styleUrls: ['chat-support.component.css'],
  animations: [
    trigger('showChat', [
      state('true', style({
        opacity: 1,
        transform: 'translateY(0)'
      })),
      state('false',   style({
        display: 'none'
      })),
      transition('* => void', [
        animate(100, style({
          opacity: 0,
          transform: 'translateY(20%)'
        }))
      ])
    ])
  ]
})
export class CoreChatSupportComponent implements OnInit, AfterViewInit {
  @ViewChild(ChatSupportDirective) chatSupport: ChatSupportDirective;

  showChat: boolean = false;
  csUserid: string;
  supporters: Array<any>;
  currentWindow: string;


  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private cookie: CookieService,
              private api: ApiBaseService,
              private chatSupportChannel: ChatSupportChannel,
              private appearanceChannel: AppearanceChannel,
              private notificationChannel: NotificationChannel) {
  }

  ngOnInit() {
    // TODO comment out here

    // this.notificationChannel.subscribe('cs');
    // if (this.notificationChannel.hasDataChanged) {
    //   this.notificationChannel.hasDataChanged
    //     .subscribe(
    //       (response: any) => {
    //         if (response.object == 'conversation') {
    //
    //         }
    //         console.log('notification has data changed', response);
    //         // this.chatSupportChannel.subscribe(response.conversation.uuid, 'cs');
    //
    //       });
    // }
  }

  ngAfterViewInit() {

    // TODO comment out here
    // // generate client id for chat support
    // this.csUserid = this.cookie.get(Constants.cookieKeys.chatSupportId); // wthapps chat support id
    // this.currentWindow = this.cookie.get(`${Constants.cookieKeys.chatSupportCurrentWindow}:${this.csUserid}`);
    // if(this.currentWindow === undefined) {
    //   this.cookie.put(
    //     `${Constants.cookieKeys.chatSupportCurrentWindow}:${this.csUserid}`,
    //     'ConversationListComponent', <CookieOptions>Constants.cookieOptionsArgs
    //   );
    // }
    //
    // if (this.csUserid == undefined) {
    //   this.api.post(`chat_support/init`, {user: null})
    //     .subscribe(
    //       (response: any) => {
    //         this.csUserid = response.data.user.uuid;
    //         this.cookie.put(Constants.cookieKeys.chatSupportId, this.csUserid, <CookieOptions>Constants.cookieOptionsArgs);
    //       }
    //     );
    // }

  }

  onShow() {
    this.showChat = !this.showChat;
    if (this.showChat) {

      console.log('current window', this.currentWindow);

      // this.appearanceChannel.subscribe('cs');
      // this.chatSupportChannel.subscribe();

      if (this.supporters == undefined) {
        this.api.get(`users/supporters`)
          .subscribe(
            (response: any) => {
              this.supporters = response.data;
              this.loadComponent();
            }
          );
      } else {
        this.loadComponent();
      }
    }
  }

  loadComponent(component?: any) {

    this.currentWindow = this.cookie.get(`${Constants.cookieKeys.chatSupportCurrentWindow}:${this.csUserid}`);

    if (component === undefined) {
      switch (this.currentWindow) {
        case 'ConversationListComponent':
          component = ConversationListComponent;
          break;
        case 'ConversationCreateComponent':
          component = ConversationCreateComponent;
          break;
        case 'ConversationEditComponent':
          component = ConversationEditComponent;
          break;
      }
    }

    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    let viewContainerRef = this.chatSupport.viewContainerRef;
    this.cookie.put(
      `${Constants.cookieKeys.chatSupportCurrentWindow}:${this.csUserid}`,
      component.name, <CookieOptions>Constants.cookieOptionsArgs
    );


    viewContainerRef.clear();
    let componentRef = viewContainerRef.createComponent(componentFactory);

    (<ChatSupportBaseComponent>componentRef.instance).data = this.csUserid;
    (<ChatSupportBaseComponent>componentRef.instance).supporters = this.supporters;
    (<ChatSupportBaseComponent>componentRef.instance).actionEvent.subscribe((action: any) => {
      this.doAction(action);
    });
  }

  doAction(action: any) {
    switch (action['name']) {
      case ChatSupportAction.createConversation:
        this.loadComponent(ConversationCreateComponent);
        break;

      case ChatSupportAction.goToDetail:
        this.loadComponent(ConversationEditComponent);
        break;

      case ChatSupportAction.goBack:
        if (action['previous'] == 'ConversationListComponent') {
          this.loadComponent(ConversationListComponent);
        } else {
          this.loadComponent(ConversationCreateComponent);
        }
        break;
    }
  }


}
