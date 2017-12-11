import {
  Component, OnInit, Output, Input, EventEmitter, AfterViewInit, ViewContainerRef, ViewChild, ComponentFactoryResolver
} from '@angular/core';
import { ChatSupportBaseComponent } from './chat-support-base.component';
import { MessageService } from './message/message.service';
import { ConversationService } from './conversation/conversation.service';
import { ChatSupportChannel } from './shared/channel/chat-support.channel';
import { UserService } from '../../../services/user.service';


declare var _: any;
declare var App: any;

@Component({
    selector: 'wth-chat-support-user-info',
  templateUrl: 'chat-support-user-info.component.html'
})
export class ChatSupportUserInfoComponent implements OnInit, AfterViewInit, ChatSupportBaseComponent {
  @Input() data: any;
  @Input() supporters: Array<any>;
  @Output() actionEvent: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('messageContainerRefs', {read: ViewContainerRef}) messageContainerRefs: ViewContainerRef;


  messages: Array<any> = new Array<any>();
  componentRef: any;

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private messageService: MessageService,
              private conversationService: ConversationService,
              private userService: UserService,
              private chatSupportChannel: ChatSupportChannel) {
  }

  ngOnInit() {
    console.log('ngOnInit');
  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit');
  }

  onBack() {
    this.actionEvent.emit({name: 'goBack', previous: 'ConversationListComponent'});
  }

  send() {
    console.log('send');
  }

  onRegister() {
    this.actionEvent.emit({name: 'goToDetail'});
  }

  onSendMessage(event: any) {
    console.log(event);
  }
}
