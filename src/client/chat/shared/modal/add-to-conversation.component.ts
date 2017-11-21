import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { ModalComponent } from 'ng2-bs3-modal/components/modal';

declare var _:any;

@Component({
  moduleId: module.id,
  selector: 'z-chat-share-add-to-conversation',
  templateUrl: 'add-to-conversation.component.html'
})

export class ZChatShareAddToConversationComponent implements OnInit {
  @Input() contact:any;
  contactItem:any;
  @ViewChild('modal') modal: ModalComponent;


  constructor(private chatService: ChatService ) {

  }

  ngOnInit() {
    this.contactItem = this.chatService.getConversations();
  }

  add() {
    let groups = _.filter(this.contactItem.value.data, { checked: true });
    let groupIds = _.map(groups, 'group_json.id');
    this.chatService.addMemberGroups(this.contact.display.id, groupIds);
    this.modal.close();
  }
}
