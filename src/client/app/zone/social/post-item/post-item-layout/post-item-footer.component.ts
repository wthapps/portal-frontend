import { Component, ElementRef, ViewChild, OnInit, Input } from '@angular/core';
import { ApiBaseService, LoadingService } from '../../../shared/index';
import {BaseZoneSocialItem} from "../../base/base-social-item";
import {SoPost} from "../../../../shared/models/social_network/so-post.model";

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'post-item-footer',
  templateUrl: 'post-item-footer.component.html'
})

export class ZSocialPostItemFooterComponent extends BaseZoneSocialItem{
  @Input() item: SoPost;
}
