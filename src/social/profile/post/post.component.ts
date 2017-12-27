import { Component, ViewChild, OnInit } from '@angular/core';
import { PostListComponent } from '../../shared/second-routes/post/post-list.component';
import { PostNewComponent } from '../../shared/second-routes/post/post-new.component';
import { ZSocialProfileDataService } from '../profile-data.service';
import { UserService } from '@wth/shared/services';


@Component({

  selector: 'z-social-profile-post',
  templateUrl: 'post.component.html'
})

export class ZSocialProfilePostComponent implements OnInit {
  @ViewChild('posts') posts: PostListComponent;
  @ViewChild('postNew') postNew: PostNewComponent;

  uuid: any;
  userInfo: any;
  relationships: any;

  constructor(private profileDataService: ZSocialProfileDataService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.profileDataService.profileData$.subscribe((res: any) => {
      this.userInfo = res.data;
      this.relationships = res.relationships;
    });
  }

  onLoadMore() {
    this.posts.viewMorePosts();
  }
}
