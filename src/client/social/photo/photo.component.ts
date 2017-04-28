import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
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
  templateUrl: 'photo.component.html',
  styleUrls: ['photo.component.css']
})
export class ZSocialPhotoComponent extends BaseZoneSocialItem implements OnInit {
  // item: SoPost;
  item: any;
  errorMessage: string = '';
  idPost: string;
  idComment: string;
  idPhoto: any;

  loadingImg: boolean = true;

  selectedPhoto: any = {
    name: 'Photo no.4',
    thumbnail_url: 'https://s3-us-west-2.amazonaws.com/env-staging-oregon/portal-frontend/zone/pictures/common-photos-do-not-delete/fishing1.jpg',
    url: 'https://s3-us-west-2.amazonaws.com/env-staging-oregon/portal-frontend/zone/pictures/common-photos-do-not-delete/fishing1.jpg',
    uuid: '0b1b0761-121e-43bf-8e68-4e981397f3ad'

  };

  constructor(private router: Router,
              private route: ActivatedRoute,
              public location: Location,
              public apiBaseService: ApiBaseService) {
    super();
  }

  ngOnInit() {

    this.route.params
      .map((params: any) => {
            this.idPost = params['id'];
            this.idPhoto = params['index'];
            this.idComment = params['idComment'];})
      .switchMap((data: any) => {
          if (this.idComment)
            return this.loadItem(this.apiBaseService.urls.zoneSoComments + '/' + this.idComment); // Load photos from comments
          else
            return this.loadItem(this.apiBaseService.urls.zoneSoPosts + '/' + this.idPost); }) // Load photos from posts
      .subscribe((response: any) => {
          this.item = response.data;
          if(this.idComment) {
            // TODO: Refractor this item to accept photo index of comment
            this.selectedPhoto = this.item.photo;
          } else {
            this.selectedPhoto = this.item.photos[this.idPhoto];
          }

        },
        ( error: any) => {
          console.error('Error when loading photo ', error);
        });
    // this.loadPost('363ce443-72a8-4d1d-9966-bebf886e3e05');
  }

  // loadPost(uuid: string): void {
  //   this.loadItem(this.apiBaseService.urls.zonePhotos + '/' + uuid)
  //     .subscribe((response: any) => {
  //         this.item = response.data;
  //         console.log(this.item);
  //       },
  //       error => {
  //       }
  //     );
  // }

  actionPhoto(e: string) {
    console.log(e);
  }

  onShowInfo() {
    $('#social-photo-detail').toggleClass('active-info');
  }

  showLoading(e: any) {
    this.loadingImg = false;
  }

  onBack() {
    // this.router.navigate(['/home']);
    this.location.back();
  }

}
