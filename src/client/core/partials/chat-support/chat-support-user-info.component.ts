import {
  Component, OnInit, Output, Input, EventEmitter, AfterViewInit, ViewContainerRef, ViewChild, ComponentFactoryResolver
} from '@angular/core';
import { ChatSupportBaseComponent } from './chat-support-base.component';
import { MessageService } from './message/message.service';
import { ConversationService } from './conversation/conversation.service';
import { UserService } from '../../shared/services/user.service';

import { NotificationChannel } from './shared/channel/notification.channel';
import { ChatSupportChannel } from './shared/channel/chat-support.channel';


declare var _: any;
declare var App: any;

@Component({
  moduleId: module.id,
  selector: 'wth-chat-support-user-info',
  templateUrl: 'chat-support-user-info.component.html'
})
export class ChatSupportUserInfoComponent implements OnInit, AfterViewInit, ChatSupportBaseComponent {
  @Input() data: any;
  @Input() supporters: Array<any>;
  @Output() actionEvent: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild ('messageContainerRefs', {read: ViewContainerRef}) messageContainerRefs: ViewContainerRef;


  messages: Array<any> = new Array<any>();
  componentRef: any;
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private messageService: MessageService,
    private conversationService: ConversationService,
    private userService: UserService,
    private chatSupportChannel: ChatSupportChannel,
    private notificationChannel: NotificationChannel
  ) {
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
  }

  onBack() {
    this.actionEvent.emit({name: 'goBack', previous: 'ConversationListComponent'});
  }

  send() {

  }

  onRegister() {
    this.actionEvent.emit({name: 'goToDetail'});
  }

  onSendMessage(event: any) {

    // create new conversation
    // this.conversationService.create({users: this.userService.profile.uuid})
    //   .subscribe(
    //     (response: any) => {
    //       var conversation: any = response.data;
    //
    //
    //
    //
    //       this.chatSupportChannel.subscribe(conversation.uuid, 'cs');
    //       console.log('sending........msg');
    //       App[`conversation:${conversation.uuid}`].sendMessage(conversation.uuid, {type: event.type, body: event.body});
    //     },
    //     error => {
    //
    //     }
    //   );



    this.messageService.sendMessage({
        senderId: this.data,
        conversation: null,
        message: {
          type: event.type,
          body: event.body
        }
      })
      .subscribe(
        (response: any) => {
          console.log('created message !!!!', response);
          let message = response.data;
          this.chatSupportChannel.subscribe(message.conversation.uuid, 'cs');

          App.csNotification.sendMessage(message.conversation.uuid, {type: event.type, body: event.body});


          App[`conversation:${message.conversation.uuid}`].sendMessage(
            message.conversation.uuid, {type: event.type, body: event.body});

        },
        error => {

        }
      );


    // this.messages = _.concat(this.messages, {type: event.type, body: event.body});
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

  }
}
