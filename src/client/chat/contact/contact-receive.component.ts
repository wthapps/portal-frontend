import { Component, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../shared/services/chat.service';
import { ZChatShareRequestContactComponent } from '../shared/modal/request-contact.component';
import { WthConfirmService } from '../../core/shared/components/confirmation/wth-confirm.service';
import { Constants } from '../../core/shared/config/constants';

@Component({
  moduleId: module.id,
  selector: 'z-chat-contact-receive',
  templateUrl: 'contact-receive.component.html'
})
export class ZChatContactReceiveComponent implements OnInit {
  tooltip: any = Constants.tooltip;

  users: any;
  @ViewChild('request') requestModal: ZChatShareRequestContactComponent;

  constructor(private chatService: ChatService, private wthConfirmService: WthConfirmService) {
  }

  ngOnInit() {
    this.chatService.apiBaseService.post('zone/chat/contact/get_share_contacts').subscribe((res: any) => {
      this.users = res.data;
    });
  }

  onAddToContact(contact: any) {
    this.requestModal.contact = contact;
    this.requestModal.modal.open();
  }

  addBlackList(contact: any) {
    this.wthConfirmService.confirm({
      message: 'Are you sure you want to add this contact to black list ?',
      header: 'Add To Black List',
      accept: () => {
        this.chatService.addGroupUserBlackList(contact.partner_id);
      }
    });
  }
}
