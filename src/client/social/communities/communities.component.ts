import { Component, ViewChild } from '@angular/core';
import { PostListComponent } from '../shared/post/post-list.component';

declare let $: any;
declare let _: any;

@Component({
  moduleId: module.id,
  selector: 'z-social-community',
  templateUrl: 'communities.component.html'
})

export class ZSocialCommunityComponent {
  @ViewChild('posts') posts: PostListComponent;
}
