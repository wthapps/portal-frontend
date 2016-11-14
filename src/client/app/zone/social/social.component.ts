import { Component, ViewChild } from '@angular/core';
import { PostNewComponent } from './post/index';
import { ZSocialPostListComponent } from "./post-list/post-list.component";
import { BaseZoneSocialHomePage } from "./base/base-social-home-page";

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-social',
  templateUrl: 'social.component.html'
})

export class ZSocialComponent extends BaseZoneSocialHomePage {
  @ViewChild('postNew') postNew: PostNewComponent;
  @ViewChild('posts') posts: ZSocialPostListComponent;

  reloadPosts(post: any) {
    this.posts.loadPosts();
  }

}
