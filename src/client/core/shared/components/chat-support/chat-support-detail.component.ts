import {
  Component, Output, Input, EventEmitter, AfterViewInit
} from '@angular/core';
import { ChatSupportBaseComponent } from './chat-support-base.component';
import { ChatSupportChannel } from './shared/channel/chat-support.channel';

declare let $: any;

@Component({
  moduleId: module.id,
  selector: 'wth-chat-support-detail',
  templateUrl: 'chat-support-detail.component.html'
})
export class ChatSupportDetailComponent implements ChatSupportBaseComponent, AfterViewInit {
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
