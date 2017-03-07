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


  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {

  }

  onShow() {
    this.showChat = !this.showChat;

    if(this.showChat) {
      this.loadComponent(ChatSupportListComponent);
    }
  }

  loadComponent(component: any) {
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    let viewContainerRef = this.chatSupport.viewContainerRef;
    viewContainerRef.clear();
    let componentRef = viewContainerRef.createComponent(componentFactory);

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
