import { Component, OnInit } from '@angular/core';
import { BaseSocialList } from '../base/base-social-list';
import { SoPost } from '../../../shared/models/social_network/so-post.model';
import { ApiBaseServiceV2 } from '../../../shared/services/apibase.service.v2';
import { SocialService } from '../services/social.service';
import { ActivatedRoute } from '@angular/router';
import { LoadingService } from '../../../partials/loading/loading.service';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'so-post-list',
  templateUrl: 'post-list.component.html'
})

export class PostListComponent extends BaseSocialList implements OnInit {
  listItems: Array<SoPost>;
  userUuid: string;

  constructor(
    public apiBaseServiceV2: ApiBaseServiceV2,
    private socialService: SocialService,
    private loadingService: LoadingService,
    private route: ActivatedRoute,
  ) {
    super();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.userUuid = params['id'];
      this.loadPosts();
    });
  }

  mapPost(post:any) {
    return new SoPost().from(post);
  }

  loadPosts() {
    this.loadingService.start('#post-list-component');
    this.socialService.post.getList(this.userUuid).subscribe(
      (res: any) => {
        this.loadingService.stop('#post-list-component');
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

  updatedPost(event: any) {
    this.loadPosts();
  }

  deletedPost(event: any) {
    this.loadPosts();
  }

}

