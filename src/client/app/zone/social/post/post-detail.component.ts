import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { BaseZoneSocialItem } from '../base/base-social-item';
import { SoPost } from '../../../shared/models/social_network/so-post.model';
import { ApiBaseServiceV2 } from '../../../shared/services/apibase.service.v2';
import { PostEditComponent, PostService } from './index';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'so-post-detail',
  templateUrl: 'post-detail.component.html'
})

export class PostDetailComponent extends BaseZoneSocialItem implements OnInit {
  @ViewChild('postEditModal') postEditModal: PostEditComponent;

  item: SoPost = new SoPost();
  errorMessage: string;

  private id: string = '';

  constructor(public apiBaseServiceV2: ApiBaseServiceV2,
              private route: ActivatedRoute,
    private postService: PostService
  ) {
  }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      this.id = params['id'];
      this.loadPost(this.id);
    });
  }

  loadPost(uuid: string): void {
    this.loadItem(this.apiBaseServiceV2.urls.zoneSoPosts + '/' + uuid)
      .subscribe((response: any) => {
          this.item = new SoPost().from(response.data);
        },
        error => {
          this.errorMessage = <any>error;
        }
      );
  }


  save(options: any = { mode: 'edit', item: null, isShare: false}) {
    this.postService.update(options.item)
    .subscribe((response: any) => {
        this.loadPost(options.item.uuid);
        this.postEditModal.close();
      },
      error => {
        console.log('error', error);
      }
    );
  }

}

