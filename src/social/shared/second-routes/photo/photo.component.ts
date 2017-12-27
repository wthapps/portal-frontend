import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import 'rxjs/add/operator/toPromise';
import { BaseZoneSocialItem } from '../../base/base-social-item';
import { ApiBaseService, PhotoService } from '@wth/shared/services';
import { Constants } from '@wth/shared/constant';



const KEY_ESC = 27;

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({

  selector: 'z-social-photo-detail',
  templateUrl: 'photo.component.html',
  styleUrls: ['photo.component.scss']
})
export class ZSocialPhotoComponent extends BaseZoneSocialItem implements OnInit {
  // item: SoPost;
  item: any;
  errorMessage: string = '';
  postId: string;
  commentId: string;
  id: any; // at present we are using uuid for this value
  ids: any;

  loading: boolean = true;

  selectedPhoto: any = null;
  hasMultiItems: boolean = false;
  prevUrl: string;

  tooltip: any = Constants.tooltip;

  constructor(private router: Router,
              private route: ActivatedRoute,
              public location: Location,
              public apiBaseService: ApiBaseService,
              private photoService: PhotoService) {
    super();
  }

  ngOnInit() {

    this.route.params
      .subscribe((params: any) => {
        this.postId = params['postId'];
        this.id = params['id'];
        this.prevUrl = params['prevUrl'];
        this.ids = params['ids'].split(',');
        if (this.ids.length > 1) {
          this.hasMultiItems = true;
        }

        this.commentId = params['commentId'];
        return this.photoService.getPhoto(this.id).toPromise()
                   .then((response: any) => {
                       // this.item = response.data;
                       this.selectedPhoto = response.data;
                     },
                     (error: any) => {
                       console.error('Error when loading photo ', error);
                     });

      });
  }

  actionPhoto(e: string) {
    console.log(e);
  }

  onShowInfo() {
    $('#social-photo-detail').toggleClass('active-info');
  }

  showLoading(e: any) {
    this.loading = false;
  }

  onBack() {
    console.log('adflajdfalskfa', this.prevUrl);
    if (typeof this.prevUrl === 'undefined') {
      this.location.back();
    } else {
      this.router.navigate([this.prevUrl]);
    }
  }

  isFirstItem(): boolean {
    return (this.id == _.head(this.ids));
  }

  isLastItem(): boolean {
    return (this.id == _.last(this.ids));
  }

  movePrevious() {
    let currentIndex = _.indexOf(this.ids, this.id);
    let index = currentIndex > 0 ? currentIndex - 1 : this.ids.length - 1;
    this.router.navigate(['/posts', this.postId, 'photos', this.ids[index], {ids: this.ids}]);

  }

  moveNext() {
    let currentIndex = _.indexOf(this.ids, this.id);
    let index = currentIndex < (this.ids.length - 1) ? currentIndex + 1 : 0;
    this.router.navigate(['/posts', this.postId, 'photos', this.ids[index], {ids: this.ids}]);
  }

}
