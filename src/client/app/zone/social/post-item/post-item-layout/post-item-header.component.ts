import { Component, ViewChild, OnInit, Input, OnChanges } from '@angular/core';
import { BaseZoneSocialItem } from "../../base/base-social-item";
import { SoPost } from "../../../../shared/models/social_network/so-post.model";
import { ZSocialPostItemComponent } from '../index';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'post-item-header',
  templateUrl: 'post-item-header.component.html'
})

export class ZSocialPostItemHeaderComponent extends BaseZoneSocialItem implements OnChanges {
  @Input() item: SoPost;
  @Input() type: string;

  showInfo: boolean = false;
  showDetail: boolean = false;


  constructor(private postItem: ZSocialPostItemComponent) {
    super();
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

  update(attr: any={}, event: any) {
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
      case 'friends':
        return 'fa-users';
      case 'public':
        return 'fa-globe';
      case 'personal':
        return 'fa-lock';
      case 'custom_friend':
        return 'fa-user-times';
      case 'custom_community':
        return 'fa-group';
    }
    return '';
  }
}
