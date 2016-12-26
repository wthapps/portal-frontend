import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { ZMediaAlbumService } from './album.service';

import { LoadingService, ConfirmationService } from '../../../shared/index';

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-media-album-list',
  templateUrl: 'album-list.component.html'
})
export class ZMediaAlbumListComponent implements OnInit {

  data: any = [];
  nextLink: string = null;

  selectedPhotos: any = [];

  keyCtrl: boolean = false;
  hasFavourite: boolean = false;
  currentView: string = 'grid';

  @HostListener('document:keydown', ['$event'])
  onKeyDown(ev: KeyboardEvent) {
    console.log(ev);
    if (ev.keyCode == 17 || ev.keyCode == 18 || ev.keyCode == 91 || ev.keyCode == 93 || ev.ctrlKey) this.keyCtrl = true;
  }

  @HostListener('document:keyup', ['$event'])
  onKeyUp(ev: KeyboardEvent) {
    if (ev.keyCode == 17 || ev.keyCode == 18 || ev.keyCode == 91 || ev.keyCode == 93 || ev.ctrlKey) this.keyCtrl = false;
  }


  constructor(private albumService: ZMediaAlbumService) {
  }

  ngOnInit() {
    this.albumService.listAlbum().subscribe((res: any)=> {
      console.log(res);
      this.data = res.data;
      this.nextLink = res.page_metadata.links.next;
    });
  }

  onLoadMore(event: any) {
    event.preventDefault();
    this.albumService.loadMore(this.nextLink).subscribe((res: any)=> {
      _.map(res.data, (v: any)=> {
        this.data.push(v);
      });
      this.nextLink = res.page_metadata.links.next;
    });
  }

  actionItem(event: any) {
    switch (event.action) {
      case 'select':
        this.onSelectedPhotos(event.data);
        break;
      case 'favourite':
        this.onOneFavourite(event.data);
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

  private onOneFavourite(item: any) {
    let findItemFavourite = _.findIndex(this.data, ['id', item.id]);
    this.albumService.actionOneFavourite(item).subscribe((res: any)=> {
      if (res.message === 'success') {
        this.data[findItemFavourite].favorite = (this.data[findItemFavourite].favorite) ? false : true;
      }
    });
  }

  // --- End Action for Item --- //
}
