import { Component, OnInit } from '@angular/core';
import { BaseSocialList } from '../base/base-social-list';
import { SoPost } from '../../../shared/models/social_network/so-post.model';
import { ApiBaseServiceV2 } from '../../../shared/services/apibase.service.v2';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'post-list',
  templateUrl: 'post-list.component.html'
})

export class ZSocialPostListComponent extends BaseSocialList implements OnInit {
  listItems: Array<SoPost>;

  constructor(
    public apiBaseServiceV2: ApiBaseServiceV2
  ) {
  }

  ngOnInit() {
    this.loadPosts();
  }

  mapPost(post:any) {
    post = new SoPost().from(post);
    return post;
  }

  loadPosts(): void {
    this.loadList(this.apiBaseServiceV2.urls.zoneSoPosts).subscribe(
      (res: any) => {
        this.listItems = res.data;
        this.listItems = _.map(this.listItems, this.mapPost);
      }
    )
  }

  /**
   * Post actions
   */

  viewDetail() {
    console.log('list viewing details..........');
  }

  edit() {
    console.log('list editing..................');
  }

  update(att: any) {
    console.log('list updating.................');
  }

  delete() {
    console.log('list deleting.................');
  }

  deletedPost(event: any) {
    this.loadPosts();
  }

}

