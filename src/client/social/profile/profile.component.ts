import { Component, OnInit, ViewChild } from '@angular/core';
import { PostListComponent } from '../shared/post/post-list.component';
import { PostNewComponent } from '../shared/post/post-new.component';
import { SocialService } from '../shared/services/social.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiBaseService } from '../../core/shared/services/apibase.service';
import { UserService } from '../../core/shared/services/user.service';
import { ZSocialProfileService } from './profile.service';
import { ZSocialProfileFormAboutComponent } from './form/about.component';
import { ZSocialProfileFormContactComponent } from './form/contact.component';
import { ZSocialProfileFormInterestComponent } from './form/interest.component';
import { ZSocialProfileFormWorkEduComponent } from './form/work-edu.component';
import { ZSocialPrivacyComponent } from './about/components/privacy.component';
import { ZSocialProfileDataService } from './profile-data.service';

declare var _: any;
export let PROFILE_TAB = {
  posts: 'posts',
  about: 'about',
  friend: 'friends'
};

@Component({
  moduleId: module.id,
  selector: 'z-social-profile',
  templateUrl: 'profile.component.html'
})

export class ZSocialProfileComponent implements OnInit {

  uuid: any;
  userInfo: any;
  actions: Array<any>;
  selectedTab: string;
  items: any;

  constructor(private socialService: SocialService,
              private route: ActivatedRoute,
              private profileDataService: ZSocialProfileDataService) {
    // this.selectedTab = PROFILE_TAB.posts;
  }

  ngOnInit() {

    // // this.loadingService.start('.zone-social-cover');
    this.route.params.switchMap((params: any) =>
      this.socialService.user.get(params['id'])
    )
      .subscribe((res: any) => {
        this.userInfo = res.data;
        this.actions = _.get(res, 'actions', []);

        this.profileDataService.addData({'userInfo': this.userInfo, 'actions' : this.actions} ); // Update userInfo to children in router-outlet
      });

  }



  // // Post tab actions
  // onLoadMore() {
  //     this.posts.viewMorePosts();
  // }

  // getTabItems(uuid: string, tab_name: string) {
  //   switch (tab_name) {
  //     case PROFILE_TAB.posts:
  //       this.socialService.user.get(this.uuid).take(1).subscribe(
  //         (res: any) => {
  //           this.items = res.data;
  //         }
  //       );
  //       break;
  //     case PROFILE_TAB.about:
  //       this.socialService.user.get(this.uuid).take(1).subscribe(
  //         (res: any) => {
  //           console.log(res);
  //           this.items = res.data;
  //           this.actions = res.actions;
  //         }
  //       );
  //       break;
  //     case PROFILE_TAB.friend:
  //
  //       this.socialService.user.getFriends(this.uuid).take(1).subscribe(
  //         (res: any) => {
  //           console.log(res);
  //           this.items = res.data;
  //         }
  //       );
  //       break;
  //     default:
  //       console.error('Unsupported tab name: '+ tab_name);
  //   }
  //
  // }


  //
  // // About tab actions
  // onUpdated(userInfo:any) {
  //   // this.userInfo = userInfo;
  // }
  //
  // onEditAbout() {
  //   console.log(this.privacyUser);
  //   this.modalAbout.modal.open();
  //   return false;
  // }
  //
  // onEditContact() {
  //   this.modalContact.modal.open();
  //   return false;
  // }
  //
  // onEditWorkEdu() {
  //   this.modalWorkEdu.modal.open();
  //   return false;
  // }
  //
  // onEditInterest() {
  //   this.modalInterest.modal.open();
  //   return false;
  // }
}
