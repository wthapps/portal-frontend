import {
  Component, OnInit, EventEmitter, Output, Input, AfterViewInit
} from '@angular/core';
import { ChatSupportBaseComponent } from './chat-support-base.component';
import { ApiBaseService } from '../../shared/services/apibase.service';
import { ChatSupportChannel } from './shared/channel/chat-support-channel';
import { AppearanceChannel } from './shared/channel/appearance-channel';

// moduleId: module.id,
//   selector: 'wth-chat-support-list',

declare var $: any;

@Component({
  moduleId: module.id,
  templateUrl: 'chat-support-list.component.html'
})
export class ChatSupportListComponent implements ChatSupportBaseComponent, OnInit, AfterViewInit {
  @Input() data: any;
  @Input() supporters: Array<any>;
  @Output() actionEvent: EventEmitter<any> = new EventEmitter<any>();
  conversations: Array<any>;

  constructor(private api: ApiBaseService,
              private chatSupportChannel: ChatSupportChannel,
              private appearanceChannel: AppearanceChannel) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {

    $('.js-intercom-content-header-list').slick({
      infinite: true,
      slidesToShow: 3,
      slidesToScroll: 3
    });

    this.appearanceChannel.subscribe('cs');
    this.chatSupportChannel.subscribe();


    this.conversations = new Array<any>();
    this.api.get(`chat_support/conversations`, {uId: this.data})
      .subscribe(
        (response: any) => {
          this.conversations = response.data;
        },
        error => {

        }
      );
  }

  goToDetail() {
    this.actionEvent.emit({name: 'goToDetail'});
  }

  createConversation() {
    this.actionEvent.emit({name: 'createConversation'});
  }


}
