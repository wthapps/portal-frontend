import { Component, Input, Output, EventEmitter, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/observable/merge';

import { LoadingService } from '../../loading/loading.service';

import { PhotoModalDataService } from '../../../../services/photo-modal-data.service';
import { PhotoUploadService } from '../../../../services/photo-upload.service';
import { WObjectListService } from '@shared/components/w-object-list/w-object-list.service';
import { WMediaSelectionService } from '@wth/shared/components/w-media-selection/w-media-selection.service';
import { take, takeUntil, switchMap, filter } from 'rxjs/operators';
import { componentDestroyed } from 'ng2-rx-componentdestroyed';

@Component({
  selector: 'cover-profile',
  templateUrl: 'cover-profile.component.html',
  styleUrls: ['cover-profile.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CoverProfileComponent implements OnDestroy {
  @Input() item: any;
  @Output() outEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(private loadingService: LoadingService,
              private mediaSelectionService: WMediaSelectionService,
              private photoUploadService: PhotoUploadService,
              private objectListService: WObjectListService) {
 }

  ngOnDestroy() {

  }

  /*
   selectPhoto function Should work when there is 1 PhotoDataSelectComponent available in current view
   */
  selectPhoto(callback: any, loadingId?: string) {
    const close$: Observable<any> = Observable.merge(this.mediaSelectionService.open$, componentDestroyed(this));

    this.mediaSelectionService.setMultipleSelection(false);
    this.mediaSelectionService.open();
    this.mediaSelectionService.selectedMedias$.pipe(
      takeUntil(close$),
      filter((items: any[]) => items.length > 0)
    ).subscribe((items) => {
      if (items.length > 0)
        callback(items);
    }, (err: any) => console.error('cover profile selectPhoto error: ', err));

    this.mediaSelectionService.uploadingMedias$.pipe(
      takeUntil(close$),
      switchMap(([file, dataUrl]) => {
        this.loadingService.start(loadingId);
        return this.photoUploadService.uploadPhotos([file]);
      })
    ).subscribe(res => {
      callback([res.data]);
      this.loadingService.stop(loadingId);
    }, err => this.loadingService.stop(loadingId));
  }


  changeProfileImage(event: any) {
    console.log('change Avatar image');
    const loadingId = '#profile_image';
    this.selectPhoto((photos: any) => {
      // Update avatar image
      const img_url = photos[0].url;
      this.item.profile_image = img_url;
      this.updateItem({'profile_image': img_url}, 'profile_image');
    }, loadingId);
  }

  changeCoverImage(event: any) {
    console.log('changeCoverImage');

    const loadingId = '#cover_image';
    this.selectPhoto((photos: Array<any>) => {
      // Update cover image
      const img_url = photos[0].url;
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
