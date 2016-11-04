import {Component, ElementRef, ViewChild, OnInit, Input, OnChanges} from '@angular/core';
import {BaseZoneSocialItem} from "../../base/base-social-item";
import {SoPost} from "../../../../shared/models/social_network/so-post.model";

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'post-item-body',
  templateUrl: 'post-item-body.component.html'
})

export class ZSocialPostItemBodyComponent extends BaseZoneSocialItem implements OnInit, OnChanges{
  @Input() item: SoPost;

  ngOnInit() {
    // this.item = new SoPost(null);
  }

  ngOnChanges() {
    // console.log(this.item);
  }
}
