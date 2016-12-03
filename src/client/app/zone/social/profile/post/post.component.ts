import { Component, ViewChild, OnInit } from '@angular/core';
import { PostListComponent } from '../../post/post-list.component';

@Component({
  moduleId: module.id,
  selector: 'z-social-profile-post',
  templateUrl: 'post.component.html'
})

export class ZSocialProfilePostComponent implements OnInit{
  @ViewChild('posts') posts: PostListComponent;

  constructor() {

  }

  ngOnInit() {
  //
  }
}
