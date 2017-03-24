import {
  Component, OnInit, ViewChild,
  trigger,
  state,
  style,
  transition,
  animate, ComponentFactoryResolver, ReflectiveInjector, AfterViewInit, ViewContainerRef, QueryList, ViewChildren
} from '@angular/core';
import { ConversationListComponent } from './conversation/conversation-list.component';
import { ConversationEditComponent } from './conversation/conversation-edit.component';
import { ConversationCreateComponent } from './conversation/conversation-create.component';

import { ChatSupportBaseComponent } from './chat-support-base.component';
import { ChatSupportDirective } from './chat-support.directive';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { Constants } from '../../shared/config/constants';
import { CookieOptionsArgs } from 'angular2-cookie/services/cookie-options-args.model';
import { ApiBaseService } from '../../shared/services/apibase.service';

import { AppearanceChannel } from './shared/channel/appearance.channel';
import { ChatSupportChannel } from './shared/channel/chat-support.channel';
import { NotificationChannel } from './shared/channel/notification.channel';

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
      state('true', style({opacity: 1, transform: 'translateY(0)'})),
      state('false', style({display: 'none'})),
      transition('void => *', [
        style({
          opacity: 0,
          transform: 'translateY(20%)'
        }),
        animate('0.3s ease-in')
      ]),
      transition('* => void', [
        animate('0.3s 10 ease-out', style({
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


  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private cookie: CookieService,
    private api: ApiBaseService,
    private chatSupportChannel: ChatSupportChannel,
    private appearanceChannel: AppearanceChannel,
    private notificationChannel: NotificationChannel
  ) {
  }

  ngOnInit() {
    this.notificationChannel.subscribe('cs');
  }

  ngAfterViewInit() {

    // generate client id for chat support
    this.csUserid = this.cookie.get(Constants.cookieKeys.chatSupportId); // wthapps chat support id
    this.currentWindow = this.cookie.get(`${Constants.cookieKeys.chatSupportCurrentWindow}:${this.csUserid}`);
    console.log('current windows: ', this.currentWindow);

    if (this.csUserid == undefined) {
      this.api.post(`chat_support/init`, {user: null})
        .subscribe(
          (response: any) => {
            this.csUserid = response.data.user.uuid;
            this.cookie.put(Constants.cookieKeys.chatSupportId, this.csUserid, <CookieOptionsArgs>Constants.cookieOptionsArgs);
          }
        );
    }

  }

  onShow() {
    this.showChat = !this.showChat;
    if(this.showChat) {

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

    if(component === undefined) {
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
      component.name, <CookieOptionsArgs>Constants.cookieOptionsArgs
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
