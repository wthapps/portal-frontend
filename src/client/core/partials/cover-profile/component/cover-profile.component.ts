import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PhotoUploadService } from '../../../shared/services/photo-upload.service';
import { PhotoModalDataService } from '../../../shared/services/photo-modal-data.service';
import { LoadingService } from '../../loading/loading.service';
import { Subscription, Observable } from 'rxjs';

@Component({
  moduleId: module.id,
  selector: 'cover-profile',
  templateUrl: 'cover-profile.component.html'
})
export class CoverProfileComponent {
  @Input() item: any;
  @Output() outEvent: EventEmitter<any> = new EventEmitter<any>();

  closeObs$: Observable<any>;
  nextPhotoSubscription: Subscription;
  uploadPhotoSubscription: Subscription;

  constructor(
    private loadingService: LoadingService,
    private photoSelectDataService: PhotoModalDataService,
    private photoUploadService: PhotoUploadService) {

    this.closeObs$ = this.photoSelectDataService.closeObs$.merge(this.photoSelectDataService.dismissObs$, this.photoSelectDataService.openObs$);
  }


  /*
    selectPhoto function Should work when there is 1 PhotoDataSelectComponent available in current view
   */
  selectPhoto(callback: any, loadingId?: string) {
    this.photoSelectDataService.open({'multipleSelect': false});
    this.nextPhotoSubscription = this.photoSelectDataService.nextObs$
      .take(1) // User can only select 1 photo to change profile avatar / cover image
      .takeUntil(this.closeObs$).subscribe(
        (photo: any) => {
          callback(photo);
        }, (err: any) => console.error('cover profile selectPhoto error: ', err));

    this.uploadPhotoSubscription = this.photoSelectDataService.uploadObs$
      .take(1)
      .takeUntil(this.closeObs$)
      .switchMap((photos: any) => { this.loadingService.start(loadingId); return this.photoUploadService.uploadPhotos(photos); })
      .subscribe(
        (res: any) => {
          callback([res.data]);
          this.loadingService.stop(loadingId);
        }, (err: any) => this.loadingService.stop(loadingId));
  }


  changeProfileImage(event: any) {
    console.log('chnage Avatar image');
    // this.loadingService.start('#profile_image');
    let loadingId: string = '#profile_image';
    this.selectPhoto((photos: any) => {
      // Update avatar image
      let img_url = photos[0].url;
      this.item.profile_image = img_url;
      this.updateItem({'profile_image': img_url}, 'profile_image');
    }, loadingId);
  }

  changeCoverImage(event: any) {
    console.log('changeCoverImage');

    let loadingId: string  = '#cover_image';
    this.selectPhoto((photos: Array<any>) => {
      // Update cover image
      let photo: any;
      let img_url = photos[0].url;
      this.item.cover_image = img_url;
      this.updateItem({'cover_image': img_url}, 'cover_image');
    }, loadingId);
  }

  // this.loadingService.start();
  updateItem(body: any, updateItem?: any, callback?: any): void {
    this.onAction({'action': 'updateItem', 'body': body, 'updateItem': updateItem});

  }

  // Perform other events beside choose Photo actions
  onAction(event: any) {
    this.outEvent.emit(event);
  }

}
