import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiBaseService } from '../../core/shared/services/apibase.service';
import { SoPost } from '../../core/shared/models/social_network/so-post.model';
import { BaseZoneSocialItem } from '../base/base-social-item';

declare var $: any;
declare var _: any;
const KEY_ESC = 27;

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'z-social-photo-detail',
  templateUrl: 'photo.component.html'
})
export class ZSocialPhotoComponent extends BaseZoneSocialItem implements OnInit {
  item: SoPost;
  errorMessage: string = '';

  selectedPhoto: any = {
    name: 'Photo no.4',
    thumbnail_url: 'https://s3-us-west-2.amazonaws.com/env-staging-oregon/portal-frontend/zone/pictures/common-photos-do-not-delete/fishing1.jpg',
    url: 'https://s3-us-west-2.amazonaws.com/env-staging-oregon/portal-frontend/zone/pictures/common-photos-do-not-delete/fishing1.jpg',
    uuid: '0b1b0761-121e-43bf-8e68-4e981397f3ad'

  };

  constructor(private router: Router, public apiBaseService: ApiBaseService) {
    super();
  }

  ngOnInit() {
    this.loadPost('363ce443-72a8-4d1d-9966-bebf886e3e05');
  }

  loadPost(uuid: string): void {
    this.loadItem(this.apiBaseService.urls.zoneSoPosts + '/' + uuid)
      .subscribe((response: any) => {
          this.item = response.data;
          console.log(this.item);
        },
        error => {
          this.errorMessage = <any>error;
        }
      );
  }

  actionPhoto(e: string) {
    console.log(e);
  }

  onShowInfo() {
    $('#social-photo-detail').toggleClass('active-info');
  }

  onBack() {
    this.router.navigate(['/home']);
  }

}
