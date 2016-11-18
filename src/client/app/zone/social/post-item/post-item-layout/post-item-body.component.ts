import { Component, ElementRef, ViewChild, OnInit, Input, OnChanges } from '@angular/core';
import { BaseZoneSocialItem } from "../../base/base-social-item";
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SoPost } from "../../../../shared/models/social_network/so-post.model";
import { ZSocialPostItemComponent } from '../post-item.component';
import { UserService } from '../../../../shared/services/user.service';

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
  actions = {
    openShare: 3,
    openActivities: 4,
    onShowPhotoDetail: 5,
    openLikeDislike: 6
  };


  hasLike: boolean = false;
  hasDislike: boolean = false;
  arrDislike: any = [];
  arrLike: any = [];

  constructor(private route: ActivatedRoute,
              public userService: UserService,
              private router: Router,
              private postItem: ZSocialPostItemComponent) {
  }

  ngOnInit() {
    // this.item = new SoPost(null);
    // console.log('ngOnInit:', this);
  }

  ngOnChanges() {

    let _this = this;
    _.map(this.item.dislikes, function (v) {
      _this.arrDislike.push(v.owner.uuid);
    });
    this.hasDislike = (this.arrDislike.indexOf(this.userService.profile.uuid) >= 0) ? true : false;

    _.map(this.item.likes, function (v) {
      _this.arrLike.push(v.owner.uuid);
    });
    this.hasLike = (this.arrLike.indexOf(this.userService.profile.uuid) >= 0) ? true : false;


    if (this.type == 'info') {
      this.showInfo = true;
    }

  }

  onActions(action: any, data?: any, type?: any) {
    switch (action) {
      case this.actions.openShare:
        this.postItem.openShare();
        break;
      case this.actions.openActivities:
        this.postItem.openActivities();
        break;
      case this.actions.openLikeDislike:
        this.postItem.openLikeDislike(data, type);
        break;
      case this.actions.onShowPhotoDetail:
        this.router.navigate(['/zone/social/photos', this.item.uuid, {index: data}]);
        break;
    }
  }
}
