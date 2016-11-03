import {Component, ElementRef, ViewChild, OnInit, Input} from '@angular/core';
import { ApiBaseService, LoadingService } from '../../../shared/index';
import {BaseSocialList} from "../base/base-social-list";
import {SoPost} from "../../../shared/models/social_network/so-post.model";
import {ApiBaseServiceV2} from "../../../shared/services/apibase.service.v2";

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'post-list',
  templateUrl: 'post-list.component.html'
})

export class ZSocialPostListComponent extends BaseSocialList implements OnInit {
  listItems: Array<SoPost>;

  constructor(private apiBaseServiceV2: ApiBaseServiceV2) {
  }

  ngOnInit() {
    this.loadList(this.apiBaseServiceV2.urls.zoneSoPosts).subscribe(
      (res:any) => {
        this.listItems = res.data;
        this.listItems = _.map(this.listItems, this.mapPost);
      }
    )
  }

  mapPost(post:any) {
    let post = new SoPost(post);
    return post;
  }
}

