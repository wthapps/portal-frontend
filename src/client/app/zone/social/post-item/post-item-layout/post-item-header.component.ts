import { Component, ViewChild, OnInit, Input } from '@angular/core';
import {BaseZoneSocialItem} from "../../base/base-social-item";
import {SoPost} from "../../../../shared/models/social_network/so-post.model";
import { ZSocialPostItemComponent } from '../index';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'post-item-header',
  templateUrl: 'post-item-header.component.html'
})

export class ZSocialPostItemHeaderComponent extends BaseZoneSocialItem{
  @Input() item: SoPost;


  constructor(private postItem: ZSocialPostItemComponent) {

  }

  viewDetail(event: any) {
    event.preventDefault();
    this.postItem.viewDetail();
  }

  update(event: any) {
    event.preventDefault();
    let attributes: Array<any> = new Array<any>();
    this.postItem.update(attributes);
  }

  edit(event: any) {
    event.preventDefault();
    this.postItem.edit();
  }

  delete(event: any) {
    event.preventDefault();
    this.postItem.delete();
  }

}
