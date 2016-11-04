import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { BaseZoneSocialItem } from '../base/base-social-item';
import { SoPost } from '../../../shared/models/social_network/so-post.model';
import { ApiBaseServiceV2 } from '../../../shared/services/apibase.service.v2';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'post-detail',
  templateUrl: 'post-detail.component.html'
})

export class ZSocialPostDetailComponent extends BaseZoneSocialItem implements OnInit {
  item: SoPost;
  errorMessage: string;

  private id: string = '';

  constructor(public apiBaseServiceV2: ApiBaseServiceV2,
              private route: ActivatedRoute) {
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
          this.item = response.data;
        },
        error => {
          this.errorMessage = <any>error;
        }
      );
  }

}

