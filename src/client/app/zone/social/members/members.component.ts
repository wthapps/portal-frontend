import { Component, OnInit } from '@angular/core';
import { SocialService } from '../services/social.service';
import { SoUser } from '../../../shared/models/social_network/so-user.model';

@Component({
  moduleId: module.id,
  selector: 'z-social-members',
  templateUrl: 'members.component.html'
})

export class ZSocialMembersComponent implements OnInit {
  errorMessage: string;
  user: SoUser = new SoUser();
  data: any = [];
  list: any = [];
  currentState: string = 'friends'; //followers, followings, blacklists

  constructor(private socialService: SocialService) {
  }

  ngOnInit() {
    this.socialService.user.get().subscribe(
      (res: any) => {
        this.data = res.data;
        this.list = res.data[this.currentState];
      },
      error => this.errorMessage = <any>error
    );
  }

  getDataList(type: string) {
    this.currentState = type;
    this.list = this.data[type];
    return false;
  }
}
