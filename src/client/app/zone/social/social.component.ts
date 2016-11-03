import { Component, ViewChild } from '@angular/core';
import { PostNewComponent } from './post/index';
import {ApiBaseServiceV2} from "../../shared/services/apibase.service.v2";
import {SoPost} from "../../shared/models/social_network/so-post.model";
import {BaseSocialList} from "./base/base-social-list";
import {ZSocialPostListComponent} from "./post-list/post-list.component";
import {BaseZoneSocialHomePage} from "./base/base-social-home-page";

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-social',
  templateUrl: 'social.component.html'
})

export class ZSocialComponent extends BaseZoneSocialHomePage{
  @ViewChild('postNew') photoSelection: PostNewComponent;
  @ViewChild('ZSocialPostListComponent') zSocialPostList: ZSocialPostListComponent;
}
