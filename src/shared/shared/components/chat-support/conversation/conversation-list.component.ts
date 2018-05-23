import {
  Component, OnInit, EventEmitter, Output, Input, AfterViewInit, ViewContainerRef
} from '@angular/core';
import { ChatSupportBaseComponent } from '../chat-support-base.component';

import { ChatSupportChannel } from '../shared/channel/chat-support.channel';
import { AppearanceChannel } from '../shared/channel/appearance.channel';
import { ApiBaseService } from '../../../../services/apibase.service';
import { UserService } from '../../../../services/user.service';


declare var $: any;

@Component({
    selector: 'cs-conversation-list',
  templateUrl: 'conversation-list.component.html'
})
export class ConversationListComponent implements ChatSupportBaseComponent, OnInit, AfterViewInit {


  @Input() data: any;
  @Input() supporters: Array<any>;
  @Output() actionEvent: EventEmitter<any> = new EventEmitter<any>();
  conversations: Array<any>;
  accounts: Array<any> = new Array<any>();
  anonymous: Array<any> = new Array<any>();

  supporter: boolean;

  constructor(private api: ApiBaseService,
              private chatSupportChannel: ChatSupportChannel,
              private appearanceChannel: AppearanceChannel,
              private userService: UserService) {
  }

  ngOnInit() {
    this.supporter = this.userService.getSyncProfile().supporter == true ;
  }

  ngAfterViewInit() {

    $('.js-intercom-content-header-list').slick({
      infinite: true,
      slidesToShow: 3,
      slidesToScroll: 3
    });

    // subscribe chat support channel
    // this.appearanceChannel.subscribe('cs');

    // this.chatSupportChannel.subscribe('cs');

    // get all registered accounts that are different supporters
    this.api.get(`users/list_account_type`)
      .subscribe(
        (response: any) => {
          this.accounts = response.data.accounts;
          this.anonymous = response.data.anonymous;
        },
        error => {
          console.log(error);
        }
      );

    this.conversations = new Array<any>();
    this.api.get(`chat_support/conversations`, {uId: this.data})
      .subscribe(
        (response: any) => {
          this.conversations = response.data;
        },
        error => {
          console.log(error);
        }
      );

    this.appearanceChannel.appearanceDataChanged.subscribe((appearanceData: any) => {
        console.log('appearance data changed', appearanceData);
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
