import { Component, ViewChild } from '@angular/core';
import { PostListComponent } from '../shared/second-routes/post/post-list.component';
import { SocialService } from '../shared/services/social.service';


/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  selector: 'z-social-home',
  templateUrl: 'home.component.html'
})
export class ZSocialHomeComponent {
  @ViewChild('posts') posts: PostListComponent;

  constructor(private socialService: SocialService) {
    this.socialService.community.currentCommunity = undefined;
  }

  onLoadMore() {
    this.posts.viewMorePosts();
  }
}
