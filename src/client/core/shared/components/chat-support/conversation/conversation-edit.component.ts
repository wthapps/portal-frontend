import {
  Component, OnInit, Output, Input, EventEmitter, AfterViewInit
} from '@angular/core';
import { ChatSupportBaseComponent } from '../chat-support-base.component';
import { ChatSupportChannel } from '../shared/channel/chat-support.channel';

declare let $: any;

@Component({
  moduleId: module.id,
  selector: 'cs-conversation-edit',
  templateUrl: 'conversation-edit.component.html'
})
export class ConversationEditComponent implements ChatSupportBaseComponent, AfterViewInit {
  @Input() data: any;
  @Input() supporters: Array<any>;
  @Output() actionEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(private chatSupportChannel: ChatSupportChannel) {
  }

  ngAfterViewInit() {
    $('.js-intercom-content-header-list').slick({
      infinite: true,
      slidesToShow: 3,
      slidesToScroll: 3
    });

    // this.chatSupportChannel.subscribe();
  }

  onBack() {
    this.actionEvent.emit({name: 'goBack', previous: 'ConversationListComponent'});
  }

  send() {
    console.log('send');
  }
}
