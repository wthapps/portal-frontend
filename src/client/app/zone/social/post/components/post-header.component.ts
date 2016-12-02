import { Component, ViewChild, OnInit, Input, OnChanges } from '@angular/core';
import { BaseZoneSocialItem } from "../../base/base-social-item";
import { SoPost } from "../../../../shared/models/social_network/so-post.model";
import { PostComponent } from '../index';
import { SocialService } from '../../services/social.service';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'so-post-header',
  templateUrl: 'post-header.component.html'
})

export class PostHeaderComponent extends BaseZoneSocialItem implements OnChanges {
  @Input() item: SoPost;
  @Input() type: string;

  showInfo: boolean = false;
  showDetail: boolean = false;
  settings:any;


  constructor(private postItem: PostComponent, private socialService: SocialService) {
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

  getSettings(e:any) {
    e.preventDefault();
    this.socialService.post.getSettings(this.item.uuid).subscribe(
      (res:any) => {

        this.settings = res.data.settings
        console.log(this.settings)
      }
    )
  }
}
