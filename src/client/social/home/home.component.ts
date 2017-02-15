import { Component, ViewChild } from '@angular/core';
import { PostListComponent } from '../shared/post/post-list.component';


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

  reloadPosts(post: any) {
    this.posts.loadPosts();
  }
}
