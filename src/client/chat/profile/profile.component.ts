import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ChatService } from '../shared/services/chat.service';

@Component({
  moduleId: module.id,
  selector: 'z-chat-profile',
  templateUrl: 'profile.component.html',
  styleUrls: ['profile.component.css']
})
export class ZChatProfileComponent implements OnInit {
  profile: any;

  constructor(private route: ActivatedRoute,
              private chatService: ChatService) {
  }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      console.log(params);
    });
    this.profile = this.chatService.getOwnUserProfile();
    console.log(this.chatService.getOwnUserProfile())
  }
}
