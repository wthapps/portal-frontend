import { Component, ViewChild } from '@angular/core';
import { PostListComponent } from '../shared/second-routes/post/post-list.component';
import { SocialService } from '../shared/services/social.service';
import { AuthService } from '@wth/shared/services';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  selector: 'z-social-home',
  templateUrl: 'home.component.html'
})
export class ZSocialHomeComponent {
  @ViewChild('posts') posts: PostListComponent;

  constructor(
    public authService: AuthService,
    private socialService: SocialService
  ) {
    this.socialService.community.currentCommunity = undefined;
  }

  onLoadMore() {
    this.posts.viewMorePosts();
  }
}
