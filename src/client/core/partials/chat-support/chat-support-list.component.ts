import {
  Component, OnInit, EventEmitter, Output, Input, AfterViewInit
} from '@angular/core';
import { ChatSupportBaseComponent } from './chat-support-base.component';
import { ApiBaseService } from '../../shared/services/apibase.service';
import { ChatSupportChannel } from './shared/channel/chat-support-channel';
import { AppearanceChannel } from './shared/channel/appearance-channel';
import { UserService } from '../../shared/services/user.service';

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
  accounts: Array<any> = new Array<any>();
  anonymous: Array<any> = new Array<any>();

  supporter: boolean;

  constructor(private api: ApiBaseService,
              private chatSupportChannel: ChatSupportChannel,
              private appearanceChannel: AppearanceChannel,
    private userService: UserService
  ) {
  }

  ngOnInit() {
    this.supporter = this.userService.profile.supporter == true ? true: false;
  }

  ngAfterViewInit() {

    $('.js-intercom-content-header-list').slick({
      infinite: true,
      slidesToShow: 3,
      slidesToScroll: 3
    });

    // subscribe chat support channel
    this.appearanceChannel.subscribe('cs');
    this.chatSupportChannel.subscribe('cs');

    // get all registered accounts that are different supporters
    this.api.get(`users/list_account_type`)
      .subscribe(
        (response: any) => {
          this.accounts = response.data.accounts;
          this.anonymous = response.data.anonymous;
        },
        error => {

        }
      );

    this.conversations = new Array<any>();
    this.api.get(`chat_support/conversations`, {uId: this.data})
      .subscribe(
        (response: any) => {
          this.conversations = response.data;
        },
        error => {

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
