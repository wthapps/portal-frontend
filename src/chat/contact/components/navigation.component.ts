import {
  Component,
  OnInit,
  Input
} from '@angular/core';
import { ChatService } from '../../shared/services/chat.service';
import { WTab } from '@shared/components/w-nav-tab/w-nav-tab';
import { ApiBaseService } from '@shared/services';

@Component({
  moduleId: module.id,
  selector: 'z-chat-contact-navigation',
  templateUrl: 'navigation.component.html'
})
export class ZChatContactMenuComponent implements OnInit {
  @Input() count: any;
  @Input() tab: any = 'all';

  constant: any;

  tabs: WTab[] = [
    {
      name: 'All Contacts',
      link: '/contacts/all',
      icon: null,
      number: null,
      type: 'link'
    },
    {
      name: 'Online',
      link: '/contacts/online',
      icon: null,
      number: null,
      type: 'link'
    },
    {
      name: 'Received',
      link: '/contacts/receive',
      icon: null,
      number: null,
      type: 'link'
    },
    {
      name: 'Pending',
      link: '/contacts/pending',
      icon: null,
      number: null,
      type: 'link'
    },
    {
      name: 'Requested',
      link: '/contacts/sent_request',
      icon: null,
      number: null,
      type: 'link'
    },
    {
      name: 'Blacklist',
      link: '/contacts/blacklist',
      icon: null,
      number: null,
      type: 'link'
    }
  ];

  constructor(
    private chatService: ChatService,
    private apiBaseService: ApiBaseService
  ) {
  }

  ngOnInit() {
    this.constant = this.chatService.constant;

    this.apiBaseService
      .post('zone/chat/contact/contact_tab_count')
      .subscribe((res: any) => {
        let tabs_w = this.tabs;
        _.map(res.data, (v: any, k: any) => {
          let tab_new: WTab = _.find(tabs_w, ['link', '/contacts/' + k]);
          if (tab_new) {
            tab_new.number = v;
          }
        });
      });
  }
}
