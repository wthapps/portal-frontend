import {
  Component, OnInit, Output, Input, EventEmitter, AfterViewInit, ViewContainerRef, ViewChild, ComponentFactoryResolver
} from '@angular/core';
import { ChatSupportBaseComponent } from '../chat-support-base.component';
import { MessageService } from '../message/message.service';
import { ConversationService } from '../conversation/conversation.service';

import { NotificationChannel } from '../shared/channel/notification.channel';
import { MessageListComponent } from '../message/message-list.component';
import { UserService } from '../../../services/user.service';

declare var _: any;
declare var App: any;

@Component({
  moduleId: module.id,
  selector: 'cs-conversation-create',
  templateUrl: 'conversation-create.component.html'
})
export class ConversationCreateComponent implements OnInit, AfterViewInit, ChatSupportBaseComponent {
  @Input() data: any;
  @Input() supporters: Array<any>;
  @Output() actionEvent: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('messageListConRef', {read: ViewContainerRef}) messageListConRef: ViewContainerRef;

  conversation: any = null;
  currentUser: any;
  messages: Array<any> = new Array<any>();
  componentRef: any;

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private messageService: MessageService,
              private conversationService: ConversationService,
              private notificationChannel: NotificationChannel,
              private userService: UserService) {
  }

  ngOnInit() {
    this.currentUser = this.userService.profile;

    this.notificationChannel.hasDataChanged
      .subscribe(
        (response: any) => {
          if (response.object == 'message') {
            this.messages = _.concat(this.messages, response.data);
          }
          if (response.object == 'conversation') {
            this.conversation = response.data.uuid;
          }

        });
  }

  ngAfterViewInit() {
    // load message for current conversation here
    // let componentFactory = this.componentFactoryResolver.resolveComponentFactory(MessageListComponent);
    // this.componentRef = this.messageListConRef.createComponent(componentFactory);

    // (<MessageListComponent>this.componentRef.instance).messages = this.messages;

    // this.chatSupportChannel.subscribe();

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

    // create new conversation

    // this.conversationService.create({users: this.userService.profile.uuid})
    //   .subscribe(
    //     (response: any) => {
    //       var conversation: any = response.data;
    //       // this.chatSupportChannel.subscribe(conversation.uuid, 'cs');
    //
    //       // console.log('app after', App);
    //
    //       this.messageService.sendMessage({senderId: this.data, conversation: conversation.uuid,
    //         message: {
    //           type: event.type,
    //           body: event.body
    //         }
    //         })
    //         .subscribe(
    //           (response: any) => { },
    //           error => { }
    //         );
    //     },
    //     error => { }
    //   );


    this.messageService.sendMessage({
      senderId: this.data,
      conversation: this.conversation,
      message: {
        type: event.type,
        body: event.body
      }
    })
      .subscribe(
        (response: any) => {
          let message = response.data;

          // this.chatSupportChannel.subscribe(message.conversation.uuid, 'cs');

          // App.csNotification.sendMessage(message.conversation.uuid, {type: event.type, body: event.body});


          // App[`conversation:${message.conversation.uuid}`].sendMessage(
          //   message.conversation.uuid, {type: event.type, body: event.body});

        },
        error => {
          console.log(error);
        }
      );


    // this.messages = _.concat(this.messages, {type: event.type, body: event.body});
    // (<MessageListComponent>this.componentRef.instance).messages = this.messages;


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
