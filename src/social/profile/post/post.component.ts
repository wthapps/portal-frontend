import { Component, ViewChild, OnInit } from '@angular/core';
import { PostListComponent } from '../../shared/second-routes/post/post-list.component';
import { ZSocialProfileDataService } from '../profile-data.service';
import { AuthService, UserService } from '@wth/shared/services';
import { SoStorageService } from '@social/shared/services/social-storage.service';


@Component({
  selector: 'z-social-profile-post',
  templateUrl: 'post.component.html'
})
export class ZSocialProfilePostComponent implements OnInit {
  @ViewChild('posts') posts: PostListComponent;

  uuid: any;
  userInfo: any;
  relationships: any;
  canCreate: boolean;

  constructor(public authService: AuthService,
              public soStorageService: SoStorageService,
              private profileDataService: ZSocialProfileDataService) { }

  ngOnInit() {
    this.profileDataService.profileData$.subscribe((res: any) => {
      this.userInfo = res.userInfo;
      this.canCreate = (this.userInfo && this.authService.user && this.userInfo.uuid === this.authService.user.uuid);
      this.relationships = res.relationships;
    });
  }

  onLoadMore() {
    this.posts.viewMorePosts();
  }
}
