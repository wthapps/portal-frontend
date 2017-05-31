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

  profileEmail: any = [
    {
      type: 'work',
      email: 'cersei.lannister@lannister.com'
    },
    {
      type: 'personal',
      email: 'drinkingproblem@lannister.com'
    }
  ];

  profilePhone: any = [
    {
      type: 'mobile',
      phone_prefix: 'CA',
      phone: '01234567890'
    },
    {
      type: 'fax',
      phone_prefix: 'VN',
      phone: '01234567890'
    }
  ];

  profileAddress: any = [
    {
      type: 'home',
      address: '14216 Kinton Parkway P.O. Box 18970 Irvine California 92618 United State'
    },
    {
      type: 'work',
      address: '14216 Kinton Parkway P.O. Box 18970 Irvine California 92618 United State'
    }
  ];

  profileMedia: any = [
    {
      type: 'facebook',
      media: 'https://www.facebook.com/'
    },
    {
      type: 'google_plus',
      media: 'https://plus.google.com/114320497877326601798'
    }
  ];

  profileNote: string = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.';

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      console.log(params);
    });
    this.profile = this.chatService.getOwnUserProfile();
    console.log(this.chatService.getOwnUserProfile())
  }
}
