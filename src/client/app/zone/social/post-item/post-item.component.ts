import {Component, ElementRef, ViewChild, OnInit, Input, OnChanges} from '@angular/core';
import {SoPost} from "../../../shared/models/social_network/so-post.model";
import {BaseZoneSocialItem} from "../base/base-social-item";

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'post-item',
  templateUrl: 'post-item.component.html'
})

export class ZSocialPostItemComponent extends BaseZoneSocialItem implements OnInit, OnChanges{
  @Input() item: SoPost;
  itemDisplay: SoPost;

  ngOnInit() {
  //
  }
  ngOnChanges() {
    this.itemDisplay = this.mapDisplay(this.item);
  }

  mapDisplay(item:SoPost) {
    item.displayCss = 'carousel-thumb-style-' + item.photos.length;
    if (item.photos.length > 6) {
      item.displayCss = 'carousel-thumb-style-6';
    }
    if (item.photos.length > 5) {
      item.remainPhotos = item.photos.length - 6 + 1;
    }
    while (item.photos.length > 6) {
      item.photos = _.dropRight(item.photos);
    }
    return item;
  }
}
