import { Component, OnChanges, Input, EventEmitter, Output, HostBinding } from '@angular/core';
import { ZMediaService } from '../../media.service';

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-media-photo-share-item',
  templateUrl: 'item.component.html',
  styles: [`
    :host {
      float: left;
      width: 20%;
      padding: 0 5px;
      margin-bottom: 10px;
    }
  `]
})
export class ZMediaPhotoShareItemComponent implements OnChanges {
  @Input() data: any;
  @Input() photoDetail: any;

  @HostBinding('class') ItemClass: string = '';

  @Output() outEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(private mediaService: ZMediaService) {
  }

  ngOnChanges() {

  }

  onFavourite() {
    this.mediaService.actionOneFavourite('photo', this.data).subscribe((res: any)=> {
      if (res.message === 'success') {
        this.data.favorite = (this.data.favorite) ? false : true;
      }
    });
  }

  onClick() {
    this.outEvent.emit(this.data);
  }

  onDbClick() {
    this.photoDetail.index = _.findIndex(this.photoDetail.allPhotos, ['id', this.data.id]);
    this.photoDetail.selectedPhotos = this.photoDetail.allPhotos;
    this.photoDetail.preview(true);
  }

}
