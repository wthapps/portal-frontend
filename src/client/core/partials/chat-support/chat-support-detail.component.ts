import {
  Component, OnInit, Output, Input, EventEmitter, AfterViewInit
} from '@angular/core';
import { ChatSupportBaseComponent } from './chat-support-base.component';
import { ChatSupportChannelService } from './shared/channel/chat-support-channel.service';

declare let $: any;

@Component({
  moduleId: module.id,
  selector: 'wth-chat-support-detail',
  templateUrl: 'chat-support-detail.component.html'
})
export class ChatSupportDetailComponent implements OnInit, ChatSupportBaseComponent, AfterViewInit {
  @Input() data: any;
  @Output() actionEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(private chatSupportChanneService: ChatSupportChannelService) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.chatSupportChanneService.subscribe();

    $('.js-intercom-content-header-list').slick({
      infinite: true,
      slidesToShow: 3,
      slidesToScroll: 3
    });

  }

  onBack() {
    this.actionEvent.emit({name: 'goBack', previous: 'ChatSupportListComponent'});
  }

  send() {

  }
}
