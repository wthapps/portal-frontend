import { Component, Input } from '@angular/core';
import { ZMediaService } from '../../media.service';

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
export class ZMediaPhotoShareItemComponent {
  @Input() data: any;

  constructor(private mediaService: ZMediaService) {
  }

  onFavourite() {
    this.mediaService.actionOneFavourite('photo', this.data).subscribe((res: any)=> {
      if (res.message === 'success') {
        this.data.favorite = (this.data.favorite) ? false : true;
      }
    });
  }

}
