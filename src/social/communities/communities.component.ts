import { Component, ViewChild } from '@angular/core';
import { PostListComponent } from '../shared/second-routes/post/post-list.component';

declare let $: any;
declare let _: any;

@Component({
  selector: 'z-social-community',
  templateUrl: 'communities.component.html'
})

export class ZSocialCommunityComponent {
  @ViewChild('posts') posts: PostListComponent;
}
