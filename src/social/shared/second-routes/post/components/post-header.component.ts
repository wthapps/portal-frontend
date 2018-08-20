import { Component, Input, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

import { SocialService } from '../../../services/social.service';
import { SoPost } from '@wth/shared/shared/models';
import { UserService } from '@wth/shared/services';
import { ZSharedReportService } from '@wth/shared/shared/components/zone/report/report.service';
import { Constants } from '@wth/shared/constant';
import { PostComponent } from '../post.component';

@Component({
  selector: 'so-post-header',
  templateUrl: 'post-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostHeaderComponent implements OnChanges {
  @Input() item: SoPost;
  @Input() type: string;
  @Input() user: any;
  @Input() privacyName: string;
  readonly tooltip: any = Constants.tooltip;

  // showInfo = false;
  // showDetail = false;
  settings: any;
  // user: User;
  readonly postUrl: string = Constants.urls.posts;
  readonly profileUrl: string = Constants.urls.profile;
  readonly postPrivacy: any = Constants.soPostPrivacy;
  // privacyClassIcon: string;


  constructor(private postItem: PostComponent,
              private socialService: SocialService,
              private router: Router,
              public userService: UserService,
              private zoneReportService: ZSharedReportService) {
  }

  ngOnChanges(data: any) {
    // if (this.type == 'info') {
    //   this.showInfo = true;
    // } else if (this.type == 'detail') {
    //   this.showDetail = true;
    // }
    // this.privacyName = this.getPrivacyName(this.item);
    // this.privacyClassIcon = this.getPrivacyClassIcon(this.item);
  }

  viewPostDetail(uuid: string) {
    this.router.navigate([], {fragment: 'detail', queryParamsHandling: 'preserve' }).then(() => {
      this.router.navigate([{outlets: {detail: [this.postUrl, uuid]}}], {queryParamsHandling: 'preserve' , preserveFragment: true});
    });
  }

  viewProfile(uuid: string) {
    this.router.navigate([{outlets: {detail: null}}], {queryParamsHandling: 'preserve' , preserveFragment: true})
      .then(() => this.router.navigate([this.profileUrl, uuid]));
  }

  update(attr: any = {}, event: any) {
    event.preventDefault();
    this.postItem.update(attr);
  }

  togglePostNotitification(uuid: string, event: any) {
    event.preventDefault();
    console.log('Toggle post notification: ', event);

    this.socialService.post.togglePostNotification(uuid).toPromise().then((res: any) => {
      this.settings = res.data;
    });
  }

  edit(event: any) {
    event.preventDefault();
    this.postItem.edit();
  }

  delete(event: any) {
    event.preventDefault();
    this.postItem.delete();
  }

  getSettings(e: any) {
    e.preventDefault();

    this.socialService.post.getSettings(this.item.uuid).toPromise().then(
      (res: any) => {
        this.settings = res.data.settings;
      });
  }

  onReport() {
    this.zoneReportService.post(this.item.uuid);
    return false;
  }

  onShowInfo() {
    console.log('inside onShowInfo');
  }

  viewPrivacyCustom(post: any, modal: any) {
    if (post.privacy === Constants.soPostPrivacy.customFriend.data || post.privacy == Constants.soPostPrivacy.customCommunity.data) {
      modal.open();
    }
  }
  // private getPrivacyName(post: any): string {
  //   if(post.privacy === Constants.soPostPrivacy.customCommunity.data && post.custom_objects.length === 1)
  //     return post.custom_objects[0].name;
  //   return post.privacy.replace('_', ' ');
  // }

  // private getPrivacyClassIcon(post: any): string {
  //   // switch (post.privacy) {
  //   //   case Constants.soPostPrivacy.friends.data:
  //   //     return 'fa-users';
  //   //   case  Constants.soPostPrivacy.public.data:
  //   //     return 'fa-globe';
  //   //   case  Constants.soPostPrivacy.personal.data:
  //   //     return 'fa-lock';
  //   //   case  Constants.soPostPrivacy.customFriend.data:
  //   //     return 'fa-user-times';
  //   //   case  Constants.soPostPrivacy.customCommunity.data:
  //   //     return 'fa-group';
  //   // }
  //   return '';
  // }
}
