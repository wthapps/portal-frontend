import {
  Component, OnInit, Output, Input, EventEmitter, AfterViewInit, ViewContainerRef, ViewChild, ComponentFactoryResolver
} from '@angular/core';
import { ChatSupportBaseComponent } from './chat-support-base.component';
import { MessageService } from './message.service';
import { ChatSupportMessageListComponent } from './message/message-list.component';
import { ChatSupportChannel } from './shared/channel/chat-support-channel';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'wth-chat-support-user-info',
  templateUrl: 'chat-support-user-info.component.html'
})
export class ChatSupportUserInfoComponent implements OnInit, AfterViewInit, ChatSupportBaseComponent {
  @Input() data: any
  @Input() supporters: Array<any>;
  @Output() actionEvent: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild ('messageContainerRefs', {read: ViewContainerRef}) messageContainerRefs: ViewContainerRef;


  messages: Array<any> = new Array<any>();
  componentRef: any;
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private messageService: MessageService,
    private chatSupportChannel: ChatSupportChannel) {
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    //load message for current conversation here
    // let componentFactory = this.componentFactoryResolver.resolveComponentFactory(ChatSupportMessageListComponent);
    // this.componentRef = this.messageContainerRefs.createComponent(componentFactory);
    // this.messages = new Array<any>();
    // (<ChatSupportMessageListComponent>this.componentRef.instance).messages = this.messages;

    // this.chatSupportChannel.subscribe();

  }

  onBack() {
    this.actionEvent.emit({name: 'goBack', previous: 'ChatSupportListComponent'});
  }

  send() {

  }

  onRegister() {
    this.actionEvent.emit({name: 'goToDetail'});
  }

  onSendMessage(event: any) {

    this.messages = _.concat(this.messages, {type: event.type, body: event.body});
    // (<ChatSupportMessageListComponent>this.componentRef.instance).messages = this.messages;

    //TODO process sending status here


    // this.messageService.sendMessage({senderId: this.data, message: {type: event.type, body: event.body}})
    //   .subscribe(
    //     (response: any) => {
    //       console.log('created message !!!!', response);
    //       //TODO process sending status here
    //     },
    //     error => {
    //       //TODO process sending status here
    //     }
    //   );


    console.log('on send message triggered', event);
  }
}
