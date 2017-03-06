import { Component, Input, OnChanges } from '@angular/core';
// import { SoPost } from '../../../../shared/models/social_network/so-post.model';
import { PostComponent } from '../index';
import { SoPost } from '../../../../core/shared/models/social_network/so-post.model';
import { UserService } from '../../../../core/shared/services/user.service';
import { SocialService } from '../../../shared/services/social.service';
import { ZoneReportService } from '../../../shared/form/report/report.service';
import { Constants } from '../../../../core/shared/config/constants';
import { User } from '../../../../core/shared/models/user.model';
// import { SocialService } from '../../services/social.service';
// import { ZoneReportService } from '../../../shared/form/report/report.service';
// import { UserService } from '../../../../shared/services/user.service';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'so-post-header',
  templateUrl: 'post-header.component.html'
})

export class PostHeaderComponent implements OnChanges {
  @Input() item: SoPost;
  @Input() type: string;

  showInfo: boolean = false;
  showDetail: boolean = false;
  settings: any;
  user: User;
  readonly postUrl: string = Constants.urls.posts;
  readonly profileUrl: string = Constants.urls.profile;


  constructor(private postItem: PostComponent,
              private socialService: SocialService,
              public userService: UserService,
              private zoneReportService: ZoneReportService) {
    this.user = this.socialService.user.profile;
  }

  ngOnChanges() {
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
    this.socialService.post.getSettings(this.item.uuid).subscribe(
      (res: any) => {
        this.settings = res.data.settings;
      }
    );
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
