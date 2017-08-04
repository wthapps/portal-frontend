import { Component, Input, OnChanges } from '@angular/core';
import { PostComponent } from '../index';
import { SoPost } from '../../../../core/shared/models/social_network/so-post.model';
import { UserService } from '../../../../core/shared/services/user.service';
import { SocialService } from '../../../shared/services/social.service';
import { Constants } from '../../../../core/shared/config/constants';
import { User } from '../../../../core/shared/models/user.model';
import { ZSharedReportService } from '../../../../core/shared/components/zone/report/report.service';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'so-post-header',
  templateUrl: 'post-header.component.html'
})

export class PostHeaderComponent implements OnChanges {
  @Input() item: SoPost;
  @Input() type: string;

  tooltip: any = Constants.tooltip;

  showInfo: boolean = false;
  showDetail: boolean = false;
  settings: any;
  user: User;
  readonly postUrl: string = Constants.urls.posts;
  readonly profileUrl: string = Constants.urls.profile;


  constructor(private postItem: PostComponent,
              private socialService: SocialService,
              public userService: UserService,
              private zoneReportService: ZSharedReportService) {
    this.user = this.socialService.user.profile;
  }

  ngOnChanges(data: any) {
    if (this.type == 'info') {
      this.showInfo = true;
    } else if (this.type == 'detail') {
      this.showDetail = true;
    }
  }

  viewDetail(event: any) {
    event.preventDefault();
    this.postItem.viewDetail();
  }

  update(attr: any = {}, event: any) {
    event.preventDefault();
    this.postItem.update(attr);
  }

  togglePostNotitification(uuid: string, event: any) {
    event.preventDefault();
    console.log('Toggle post notification: ', event);

    this.socialService.post.togglePostNotification(uuid).subscribe((res: any) => {
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

  privacyName(post: any): string {
    return post.privacy.replace('_', ' ');
  }

  privacyClassIcon(post: any): string {
    switch (post.privacy) {
      case Constants.soPostPrivacy.friends.data:
        return 'fa-users';
      case  Constants.soPostPrivacy.public.data:
        return 'fa-globe';
      case  Constants.soPostPrivacy.personal.data:
        return 'fa-lock';
      case  Constants.soPostPrivacy.customFriend.data:
        return 'fa-user-times';
      case  Constants.soPostPrivacy.customCommunity.data:
        return 'fa-group';
    }
    return '';
  }

  getSettings(e: any) {
    e.preventDefault();
    // Only get settings when the pop up form shown up
    // if (e.target.attributes['aria-expanded'].value === 'true')
    //   return;

    this.socialService.post.getSettings(this.item.uuid).take(1).subscribe(
      (res: any) => {
        this.settings = res.data.settings;
      });
  }


  onReport() {
    this.zoneReportService.post(this.item.uuid);
    return false;
  }

  onShowInfo() {

  }

  viewPrivacyCustom(post: any, modal: any) {
    if (post.privacy == Constants.soPostPrivacy.customFriend.data || post.privacy == Constants.soPostPrivacy.customCommunity.data) {
      modal.open();
    }
  }

}
