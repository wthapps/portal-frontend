import { Component, ViewChild, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PostListComponent } from '../../shared/second-routes/post/post-list.component';
import { PostNewComponent } from '../../shared/second-routes/post/post-new.component';
import { SocialService } from '../../shared/services/social.service';
import { ApiBaseService } from '../../../core/shared/services/apibase.service';
import { UserService } from '../../../core/shared/services/user.service';
import { ZSocialProfileDataService } from '../profile-data.service';



@Component({
  moduleId: module.id,
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
