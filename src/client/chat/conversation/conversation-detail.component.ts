import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ChatService } from '../shared/services/chat.service';
import { PubSubEvent } from '../../core/shared/services/pub-sub/pub-sub-event';
import { PubSubAction } from '../../core/shared/services/pub-sub/pub-sub-action';
import { Subscription } from 'rxjs';
import { PubSubEventService } from '../../core/shared/services/pub-sub/pub-sub-event.service';
import { CHAT_ACTIONS, FORM_MODE } from '../shared/constants/chat-constant';
import { MessageListComponent } from '../shared/message/message-list.component';
import { MessageEditorComponent } from '../shared/message/editor/message-editor.component';
import { ConversationService } from './conversation.service';

@Component({
  moduleId: module.id,
  selector: 'conversation-detail',
  templateUrl: 'conversation-detail.component.html'
})
export class ConversationDetailComponent implements PubSubAction, OnInit, OnDestroy {
  @ViewChild('messageList') messageList: MessageListComponent;
  @ViewChild('messageEditor') messageEditor: MessageEditorComponent;
  item: any;

  subscriptionPubSub: Subscription;

  constructor(
    private chatService: ChatService,
    private pubSubEvent: PubSubEventService,
    private conversationService: ConversationService
  ) {}

  ngOnInit() {

    //subscribe all

    this.subscriptionPubSub = this.pubSubEvent.event.subscribe((event: PubSubEvent) => {
      this.doAction(event);
    });

    this.item = this.chatService.getCurrentMessages();
  }

  doAction(event: PubSubEvent) {
    console.log('actioning....................');
    switch (event.action) {
      case CHAT_ACTIONS.CHAT_MESSAGE_COPY:

        break;
      case CHAT_ACTIONS.CHAT_MESSAGE_QUOTE:
        break;
      case CHAT_ACTIONS.CHAT_MESSAGE_EDIT:
        this.messageEditor.updateAttributes({message: event.payload, mode: FORM_MODE.EDIT});
        this.messageEditor.focus();

        break;
      case CHAT_ACTIONS.CHAT_MESSAGE_DOWNLOAD:
        break;
      case CHAT_ACTIONS.CHAT_MESSAGE_DELETE:
        this.conversationService.deleteMessage(event.payload.group_id, event.payload.id)
          .subscribe((response: any) => {
            console.log('delete ok!!!!');
          }, error => {

          });

        break;
    }
  }

  ngOnDestroy() {
    this.subscriptionPubSub.unsubscribe();
  }
}
