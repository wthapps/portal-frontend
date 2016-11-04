import { Component, ViewChild, OnInit, Input } from '@angular/core';
import {BaseZoneSocialItem} from "../../base/base-social-item";
import {SoPost} from "../../../../shared/models/social_network/so-post.model";

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'post-item-header',
  templateUrl: 'post-item-header.component.html'
})

export class ZSocialPostItemHeaderComponent extends BaseZoneSocialItem{
  @Input() item: SoPost;
}
