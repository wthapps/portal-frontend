import { Component, ViewChild, OnInit } from '@angular/core';
import { PostNewComponent } from '../post/index';
import { ZSocialPostListComponent } from "../post-list/post-list.component";
import { BaseZoneSocialHomePage } from "../base/base-social-home-page";

import { ApiBaseService } from '../../../shared/services/apibase.service';

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-social-profile',
  templateUrl: 'profile.component.html'
})

export class ZSocialProfileComponent extends BaseZoneSocialHomePage implements OnInit {
  @ViewChild('postNew') postNew: PostNewComponent;
  @ViewChild('posts') posts: ZSocialPostListComponent;


  userInfo: any = null;
  errorMessage: string = '';

  constructor(private apiService: ApiBaseService) {
  }

  ngOnInit() {
    this.getUserInfo();
  }

  reloadPosts(post: any) {
    this.posts.loadPosts();
  }

  getUserInfo() {
    this.apiService.get('/zone/social_network/users/user')
      .subscribe((res: any) => {
          this.userInfo = res.data;
          console.log(res);
        },
        error => {
          this.errorMessage = <any>error;
        }
      );
  }

}
