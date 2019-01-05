import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { BsModalComponent } from 'ng2-bs3-modal';
import { Observable } from 'rxjs/Observable';

import { ChatService } from '../services/chat.service';
import { ChatConversationService } from '../services/chat-conversation.service';

declare var _:any;

@Component({
  selector: 'z-chat-share-add-to-conversation',
  templateUrl: 'add-to-conversation.component.html'
})

export class ZChatShareAddToConversationComponent implements OnInit {
  @Input() contact:any;
  contactItem:any;
  @ViewChild('modal') modal: BsModalComponent;
  usersOnlineItem$: Observable<any>;


  constructor(private chatService: ChatService, private chatConversationService: ChatConversationService ) {

  }

  ngOnInit() {
    this.contactItem = this.chatConversationService.apiGetConversations();
    this.usersOnlineItem$ = this.chatService.getUsersOnline()
  }

  add() {
    let groups = _.filter(this.contactItem.value.data, { checked: true });
    let groupIds = _.map(groups, 'group_json.id');
    this.chatService.addMemberGroups(this.contact.display.id, groupIds);
    this.modal.close();
  }
}
