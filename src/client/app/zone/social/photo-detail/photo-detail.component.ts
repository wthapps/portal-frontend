import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { BaseZoneSocialItem } from '../base/base-social-item';
import { SoPost } from '../../../shared/models/social_network/so-post.model';
import { ApiBaseServiceV2 } from '../../../shared/services/apibase.service.v2';

import { Constants } from '../../shared/index';

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'zone-social-photo-detail',
  templateUrl: 'photo-detail.component.html'
})

export class ZSocialPhotoDetailComponent extends BaseZoneSocialItem implements OnInit {
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
    this.showPreview();
  }

  ngOnDestroy() {
    this.hidePreview();
  }

  showPreview(): void {
    $('body').addClass('fixed-hidden').css('padding-right', Constants.windows.scrollBarWidth);
    $('#photo-box-detail').addClass('active');
    $('#photo-box-detail').addClass('active-info');
  }

  hidePreview(): void {
    $('body').removeClass('fixed-hidden').css('padding-right', 0);
    $('#photo-box-detail').removeClass('active');
    $('#photo-box-detail').removeClass('active-info');
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

