import { Component, ViewChild } from '@angular/core';
import { PostListComponent } from '../shared/post/post-list.component';
import { SocialService } from '../shared/services/social.service';


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

  constructor(private socialService:SocialService) {
    this.socialService.community.currentCommunity = undefined;
  }

  reloadPosts(post: any) {
    this.posts.loadPosts();
  }
}
