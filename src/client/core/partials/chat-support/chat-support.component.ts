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

@Component({
  moduleId: module.id,
  selector: 'wth-chat-support',
  templateUrl: 'chat-support.component.html',
  styleUrls: ['chat-support.component.css'],
  animations: [
    trigger('chatState', [
      state('active', style({opacity: 1, transform: 'translateY(0)'})),
      state('inactive', style({display: 'none'})),
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
  // @ViewChild('chatSupportList') chatSupportList: ChatSupportListComponent;
  // @ViewChild('chatSupportDetail') chatSupportDetail: ChatSupportDetailComponent;
  // @ViewChild('chatSupportUserInfo') chatSupportUserInfo: ChatSupportUserInfoComponent;
  @ViewChild(ChatSupportDirective) chatSupport: ChatSupportDirective;
  // @ViewChild('chatSupport', {read: ViewContainerRef}) chatSupport: ViewContainerRef;

  // @ViewChildren('chatSupport', {read: ViewContainerRef}) chatSupport: QueryList;


  // private chatSupport: ViewContainerRef;
  //
  // @ViewChild('chatSupport') set content(content: ViewContainerRef) {
  //   this.chatSupport = content;
  // }

  showChatList: boolean = true;
  chatState: string = 'inactive';

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    if(this.chatState == 'active') {
      this.loadComponent(ChatSupportListComponent);
    }
  }

  onShow() {
    this.chatState = (this.chatState == 'inactive' ? 'active' : 'inactive');
    if(this.chatState == 'active') {
      this.loadComponent(ChatSupportListComponent);
    }
  }

  onShowChatList(e: boolean) {
    this.showChatList = (e ? false : true);
  }

  loadComponent(component: any) {
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    let viewContainerRef = this.chatSupport.viewContainerRef;
    viewContainerRef.clear();
    let componentRef = viewContainerRef.createComponent(componentFactory);
    // this.chatSupport.createComponent(componentFactory);
    console.log('component', typeof(component));

    if (componentRef.instance.clickDetail !== undefined) {
      componentRef.instance.clickDetail.subscribe(() => {
        this.createNewConversation(null);
      })
    }
  }

  createNewConversation(event: any) {
    this.loadComponent(ChatSupportDetailComponent);
  }

}
