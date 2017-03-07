import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { ConfirmationService } from 'primeng/components/common/api';

import { LoadingService } from '../../core/partials/loading/loading.service';

import { ZMediaAlbumService } from './album.service';

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


  constructor(private router: Router,
              private albumService: ZMediaAlbumService,
              private confirmationService: ConfirmationService,
              private loadingService: LoadingService) {
  }

  ngOnInit() {
    this.albumService.listAlbum().subscribe((res: any)=> {
      this.data = res.data;
      this.nextLink = res.page_metadata.links.next;
    });
  }

  onLoadMore() {
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
      case 'previewAll':
        this.router.navigate([`/media/album`, event.data.id]);
        break;
      case 'favourite':
        this.onOneFavourite(event.data);
        break;
      default:
        break;
    }
  }

  actionToolbar(event: any) {
    // console.log(event);
    switch (event) {
      case 'oneFavourite':
        this.onFavourite();
        break;
      case 'favourite':
        this.onFavourite();
        break;
      case 'share':

        break;
      case 'tag':

        break;
      case 'delete':
        this.onDelete();
        break;
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

  private onOneFavourite(item: any) {
    let findItemFavourite = _.findIndex(this.data, ['id', item.id]);
    this.albumService.actionOneFavourite(item).subscribe((res: any)=> {
      if (res.message === 'success') {
        this.data[findItemFavourite].favorite = (this.data[findItemFavourite].favorite) ? false : true;
      }
    });
  }

  // --- End Action for Item --- //


  // --- Action for Toolbar --- //
  private onFavourite() {
    // if there was one item's favorite is false, all item will be add to favorite
    let hasFavourite: boolean = _.some(this.selectedPhotos, ['favorite', false]);
    this.albumService.actionAllFavourite(this.selectedPhotos, hasFavourite).subscribe((res: any)=> {
      if (res.message === 'success') {
        _.map(this.selectedPhotos, (v: any)=> {
          v.favorite = hasFavourite;
        });
      }
    });
  }

  private onDelete() {
    let idPhotos = _.map(this.selectedPhotos, 'id'); // ['1','2'];
    this.confirmationService.confirm({
      message: 'Are you sure to delete ' + this.selectedPhotos.length + ' item' + (this.selectedPhotos.length > 1 ? 's' : '') + ' ?',
      accept: () => {
        let body = JSON.stringify({ids: idPhotos});
        this.loadingService.start();
        this.albumService.deletePhoto(body).subscribe((res: any)=> {
          _.map(idPhotos, (id: any)=> {
            _.remove(this.data, ['id', id]);
          });
          this.loadingService.stop();
        });
      }
    });
  }

  // --- End Action for Toolbar --- //
}
