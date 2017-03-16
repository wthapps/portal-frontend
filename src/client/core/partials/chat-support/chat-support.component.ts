import {
  Component, OnInit, ViewChild,
  trigger,
  state,
  style,
  transition,
  animate, ComponentFactoryResolver, ReflectiveInjector, AfterViewInit, ViewContainerRef, QueryList, ViewChildren
} from '@angular/core';
import { ChatSupportListComponent } from './chat-support-list.component';
import { ChatSupportDetailComponent } from './chat-support-detail.component';
// import { ChatSupportUserInfoComponent } from './chat-support-user-info.component';
// import { ChatSupportDirective } from './chat-support.module';
import { ChatSupportBaseComponent } from './chat-support-base.component';
import { ChatSupportDirective } from './chat-support.directive';
import { ChatSupportUserInfoComponent } from './chat-support-user-info.component';
import { ChatSupportChannel } from './shared/channel/chat-support-channel';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { Constants } from '../../shared/config/constants';
import { CookieOptionsArgs } from 'angular2-cookie/services/cookie-options-args.model';
import { ApiBaseService } from '../../shared/services/apibase.service';
import { AppearanceChannel } from './shared/channel/appearance-channel';

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
  currentView: string;
  csUserid: string;
  supporters: Array<any>;


  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private cookie: CookieService,
    private api: ApiBaseService,
    private chatSupportChannel: ChatSupportChannel,
    private appearanceChannel: AppearanceChannel
  ) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {

    // generate client id for chat support
    this.csUserid = this.cookie.get(Constants.cookieKeys.chatSupportId); // wthapps chat support id
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

    console.log('opening chatting...................');

    if(this.showChat) {
      // this.appearanceChannel.subscribe('cs');
      // this.chatSupportChannel.subscribe();

      if (this.supporters == undefined) {
        this.api.get(`users/supporters`, null)
          .subscribe(
            (response: any) => {
              this.supporters = response.data;
              this.loadComponent(ChatSupportListComponent);
            }
          );
      } else {
        this.loadComponent(ChatSupportListComponent);
      }
    }
  }

  loadComponent(component: any) {
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    let viewContainerRef = this.chatSupport.viewContainerRef;
    viewContainerRef.clear();
    let componentRef = viewContainerRef.createComponent(componentFactory);

    console.log('current component ref', componentRef);

    (<ChatSupportBaseComponent>componentRef.instance).data = this.csUserid;
    (<ChatSupportBaseComponent>componentRef.instance).supporters = this.supporters;
    (<ChatSupportBaseComponent>componentRef.instance).actionEvent.subscribe((action: any) => {
      this.doAction(action);
    });
  }

  doAction(action: any) {
    switch (action['name']) {
      case ChatSupportAction.createConversation:
        this.loadComponent(ChatSupportUserInfoComponent);
        break;

      case ChatSupportAction.goToDetail:
        this.loadComponent(ChatSupportDetailComponent);
        break;

      case ChatSupportAction.goBack:
        if (action['previous'] == 'ChatSupportListComponent') {
          this.loadComponent(ChatSupportListComponent);
        } else {
          this.loadComponent(ChatSupportUserInfoComponent);
        }
        break;
    }
  }



}
