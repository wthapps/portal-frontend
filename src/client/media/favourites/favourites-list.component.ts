import { Component, OnInit } from '@angular/core';

import 'rxjs/add/operator/toPromise';

import { ZMediaFavoriteService } from './favourites.service';
import { PhotoService } from '../../core/shared/services/photo.service';

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-media-favourites-list',
  templateUrl: 'favourites-list.component.html'
})
export class ZMediaFavoriteListComponent implements OnInit {

  data: any = [];
  nextLink: string = null;

  selectedPhotos: any = [];

  keyCtrl: boolean = false;
  hasFavourite: boolean = false;
  currentView: string = 'grid';

  favouriteIsEmpty: boolean = false;


  constructor(private photoService: PhotoService,
              private favoriteService: ZMediaFavoriteService) {
  }

  ngOnInit() {
    // this.getFavorite();
    return;
  }

  getFavorite(body:any = {}) {
    return;
  }

  onLoadMore(event: any) {
    return;
  }


  actionItem(event: any) {
    //console.log(event);
    switch (event.action) {
      case 'select':
        this.onSelectedPhotos(event.data);
        break;
      case 'previewAll':
        this.onPreviewAll(event.data);
        break;
      case 'favourite':
        this.onOneFavourite(event.data);
        break;
      case 'sort':
        this.sort(event.data);
        break;
      default:
        break;
    }
  }

  actionToolbar(event: any) {
    // console.log(event);
    switch (event) {
      case 'listView':
        this.currentView = 'list';
        break;
      case 'gridView':
        this.currentView = 'grid';
        break;
      default:
        break;
    }
  }

  // --- Action for Item --- //
  private onSelectedPhotos(item: any) {
    if (this.keyCtrl) {
      if (_.some(this.selectedPhotos, ['id', item.id])) {
        $('#photo-box-img-' + item.id).removeClass('selected');
        _.remove(this.selectedPhotos, ['id', item.id]);
      } else {
        $('#photo-box-img-' + item.id).addClass('selected');
        this.selectedPhotos.push(item);
      }
    } else {
      $('.row-img .photo-box-img').removeClass('selected');
      $('#photo-box-img-' + item.id).addClass('selected');
      this.selectedPhotos.length = 0;
      this.selectedPhotos.push(item);
      console.log(this.selectedPhotos);
    }
    this.hasFavourite = _.some(this.selectedPhotos, ['favorite', false]);
  }

  private onPreviewAll(item: any) {
  }

  private onOneFavourite(item: any) {
    let findItemFavourite = _.findIndex(this.data.albums, ['id', item.id]);
    this.photoService.actionOneFavourite(item).toPromise().then((res: any)=> {
      if (res.message === 'success') {
        this.data.albums[findItemFavourite].favorite = (this.data.albums[findItemFavourite].favorite) ? false : true;
      }
    });
  }

  private sort(data:any) {
    this.getFavorite(data);
  }

  // --- End Action for Item --- //

}
