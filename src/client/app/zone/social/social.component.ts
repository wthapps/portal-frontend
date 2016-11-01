import {Component, ViewChild, OnInit} from '@angular/core';
import { SoPhotoSelectionComponent } from './post/index';
import {ApiBaseServiceV2} from "../../shared/services/apibase.service.v2";
import {SoPost} from "../../shared/models/social_network/so-post.model";

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-social',
  templateUrl: 'social.component.html'
})

export class ZSocialComponent implements OnInit{
  @ViewChild('photoselection') photoSelection: SoPhotoSelectionComponent;
  soPosts: Array<SoPost>;
  soPostsDisplay: Array<SoPost>;

  constructor(private apiBaseServiceV2: ApiBaseServiceV2) {
  }

  ngOnInit() {
    this.apiBaseServiceV2.get(this.apiBaseServiceV2.urls.zoneSoPosts).subscribe(
      (res:any) => {
        console.log(res);
        this.soPosts = _.map(res.data, this.mapPost);
        this.soPostsDisplay = _.cloneDeep(this.soPosts);
        this.soPostsDisplay =  _.map(this.soPostsDisplay, this.mapPostDisplay);
      }
    )
  }

  mapPost(post:any) {
    let post = new SoPost(post);
    post.displayCss = 'carousel-thumb-style-' + post.photos.length;
    if (post.photos.length > 6) {
      post.displayCss = 'carousel-thumb-style-6';
    }
    return post;
  }

  mapPostDisplay(post:SoPost) {
    if (post.photos.length > 5) {
      post.remainPhotos = post.photos.length - 6 + 1;
    }
    while (post.photos.length > 6) {
      post.photos = _.dropRight(post.photos);
    }
    return post;
  }

}
