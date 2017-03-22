import { Component, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { PostListComponent } from '../shared/post/post-list.component';
import { SocialService } from '../shared/services/social.service';
import { Router, NavigationEnd } from '@angular/router';


declare var $: any;
declare var _: any;

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'z-social-home',
  templateUrl: 'home.component.html'
})
export class ZSocialHomeComponent {
  // @ViewChild('postNew') postNew: PostNewComponent;
  @ViewChild('posts') posts: PostListComponent;

  constructor(private socialService: SocialService,
              private router: Router) {
    this.socialService.community.currentCommunity = undefined;

  }

  onLoadMore() {
    console.log(this.posts.viewMorePosts());
  }
}
