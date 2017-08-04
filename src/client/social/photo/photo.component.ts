import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ApiBaseService } from '../../core/shared/services/apibase.service';
import { BaseZoneSocialItem } from '../base/base-social-item';
import { PhotoService } from '../../core/shared/services/photo.service';
import { Constants } from '../../core/shared/config/constants';

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
        return this.photoService.getPhoto(this.id)
                   .then((response: any) => {
                       // this.item = response.data;
                       this.selectedPhoto = response.data;
                     },
                     (error: any) => {
                       console.error('Error when loading photo ', error);
                     });

      });
    // if (this.idComment)
    //       return this.loadItem(this.apiBaseService.urls.zoneSoComments + '/' + this.idComment); // Load photos from comments
    //     else
    //       return this.loadItem(this.apiBaseService.urls.zoneSoPosts + '/' + this.postId); }) // Load photos from posts
    // .subscribe((response: any) => {
    //     this.item = response.data;
    //     if(this.idComment) {
    //       // TODO: Refractor this item to accept photo index of comment
    //       this.selectedPhoto = this.item.photo;
    //     } else {
    //       this.selectedPhoto = this.item.photos[this.id];
    //     }
    //
    //   },
    //   ( error: any) => {
    //     console.error('Error when loading photo ', error);
    //   });
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
