import { Component, ElementRef, ViewChild, OnInit, Input, OnChanges } from '@angular/core';
import { BaseZoneSocialItem } from "../../base/base-social-item";
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SoPost } from "../../../../shared/models/social_network/so-post.model";
import { ZSocialPostItemComponent } from '../post-item.component';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'post-item-body',
  templateUrl: 'post-item-body.component.html'
})

export class ZSocialPostItemBodyComponent extends BaseZoneSocialItem implements OnInit, OnChanges {
  @Input() item: SoPost;
  @Input() type: string;

  showInfo: boolean = false;
  actions =	{openShare: 3, openActivities: 4, onShowPhotoDetail: 5};

  constructor(private route: ActivatedRoute,
              private router: Router,
              private postItem: ZSocialPostItemComponent) {
  }

  ngOnInit() {
    // this.item = new SoPost(null);
  }

  ngOnChanges() {
    if (this.type == 'info') {
      this.showInfo = true;
    }
  }

  onActions(action:any, data?:any) {
    switch (action) {
      case this.actions.openShare:
        this.postItem.openShare();
        break;
      case this.actions.openActivities:
        this.postItem.openActivities();
        break;
      case this.actions.onShowPhotoDetail:
        this.router.navigate(['/zone/social/photos', this.item.uuid, { index: data }]);
        break;
    }
  }
}
