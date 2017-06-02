import { Component, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ChatService } from '../shared/services/chat.service';
import { ZChatShareRequestContactComponent } from '../shared/modal/request-contact.component';

@Component({
  moduleId: module.id,
  selector: 'z-chat-profile',
  templateUrl: 'profile.component.html',
  styleUrls: ['profile.component.css']
})
export class ZChatProfileComponent implements OnInit {
  profile: any;
  actions: any;
  contact: any;
  @ViewChild('request') requestModal: ZChatShareRequestContactComponent;

  constructor(private route: ActivatedRoute,
              private chatService: ChatService) {
  }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      this.chatService.apiBaseService.get('zone/social_network/users/'+ params['id'], {module_name: 'chat'}).subscribe((res:any) => {
        this.profile = res.data;
        this.actions = res.actions;
        this.contact = this.chatService.getContactByPartnerId(this.profile.id);
      });
    });
  }

  onFavorite() {
    this.chatService.addGroupUserFavorite(this.contact);
  }

  onSelect(user:any) {
    this.chatService.selectContactByPartnerId(user.id);
  }

  onRequest(user:any) {
    this.requestModal.contact = user;
    this.requestModal.modal.open();
  }

  onClose() {
    setTimeout(()=>{ this.chatService.apiBaseService.get('zone/social_network/users/'+ this.profile.uuid, {module_name: 'chat'}).subscribe((res:any) => {
      this.profile = res.data;
      this.actions = res.actions;
      this.contact = this.chatService.getContactByPartnerId(this.profile.id);
    })}, 500);
  }
}
