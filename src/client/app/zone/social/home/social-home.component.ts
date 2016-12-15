import { Component, ViewChild } from '@angular/core';
import { PostNewComponent } from '../post/index';
import { PostListComponent } from '../post/post-list.component';

@Component({
  moduleId: module.id,
  selector: 'z-social-home',
  templateUrl: 'social-home.component.html'
})

export class ZSocialHomeComponent {
  @ViewChild('postNew') postNew: PostNewComponent;
  @ViewChild('posts') posts: PostListComponent;

  reloadPosts(post: any) {
    this.posts.loadPosts();
  }

}
