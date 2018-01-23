import { Component, ViewChild, AfterViewInit, HostListener, OnInit } from '@angular/core';
import { PostListComponent } from '../shared/second-routes/post/post-list.component';
import { SocialService } from '../shared/services/social.service';
import { Router, NavigationEnd } from '@angular/router';
import { SocialFavoriteService } from '../shared/services/social-favorites.service';
import { UserService } from '@wth/shared/services';





/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({

  selector: 'z-social-home',
  templateUrl: 'home.component.html'
})
export class ZSocialHomeComponent implements OnInit {
  @ViewChild('introModal') introModal: any;
  @ViewChild('posts') posts: PostListComponent;

  constructor(private socialService: SocialService,
              public favoriteService: SocialFavoriteService,
              public userService: UserService,
              private router: Router) {
    this.socialService.community.currentCommunity = undefined;

  }

  ngOnInit() {
    if(!_.get(this.userService.getSyncProfile(), 'introduction.social')) this.introModal.open();
  }

  onLoadMore() {
    this.posts.viewMorePosts();
  }
}
