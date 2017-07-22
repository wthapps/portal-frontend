import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ChatService } from '../shared/services/chat.service';
import { CommonEvent } from '../../core/shared/services/common-event/common-event';
import { CommonEventAction } from '../../core/shared/services/common-event/common-event-action';
import { Subscription } from 'rxjs/Subscription';
import { CommonEventService } from '../../core/shared/services/common-event/common-event.service';
import { CHAT_ACTIONS, FORM_MODE } from '../../core/shared/constant/chat-constant';
import { MessageListComponent } from '../shared/message/message-list.component';
import { MessageEditorComponent } from '../shared/message/editor/message-editor.component';
import { ConversationService } from './conversation.service';

declare  var _: any;
declare  var $: any;

@Component({
  moduleId: module.id,
  selector: 'conversation-detail',
  templateUrl: 'conversation-detail.component.html'
})
export class ConversationDetailComponent implements CommonEventAction, OnInit, OnDestroy {
  @ViewChild('messageList') messageList: MessageListComponent;
  @ViewChild('messageEditor') messageEditor: MessageEditorComponent;
  item: any;

  commonEventSub: Subscription;

  constructor(
    private chatService: ChatService,
    private commonEventService: CommonEventService,
    private conversationService: ConversationService
  ) {}

  ngOnInit() {

    //subscribe all

    this.commonEventSub = this.commonEventService.event.subscribe((event: CommonEvent) => {
      this.doEvent(event);
    });

    this.item = this.chatService.getCurrentMessages();
  }

  doEvent(event: CommonEvent) {
    switch (event.action) {
      case CHAT_ACTIONS.CHAT_MESSAGE_COPY:
        this.messageEditor.updateAttributes({message: event.payload, mode: FORM_MODE.CREATE});
        this.messageEditor.focus();
        // Real copy
        let temp = $("<input>");
        $("body").append(temp);
        temp.val(event.payload.message).select();
        document.execCommand("copy");
        temp.remove();
        break;
      case CHAT_ACTIONS.CHAT_MESSAGE_QUOTE:
        _.assign(event.payload, {is_quote: true});
        this.messageEditor.updateAttributes({message: event.payload, mode: FORM_MODE.CREATE});
        this.messageEditor.focus();
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
    this.commonEventSub.unsubscribe();
  }
}
