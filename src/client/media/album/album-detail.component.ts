import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { ConfirmationService } from 'primeng/components/common/api';

import { LoadingService } from '../../core/partials/loading/loading.service';

import { ZMediaAlbumService } from './album.service';

import { ZMediaPhotoDetailComponent } from '../photo/photo-detail.component';
import { ZMediaPhotoService } from '../photo/photo.service';

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-media-album-detail',
  templateUrl: 'album-detail.component.html'
})
export class ZMediaAlbumDetailComponent implements OnInit {
  @ViewChild('photoDetail') photoDetail: ZMediaPhotoDetailComponent;
  albumDetail: any = [];

  data: any = [];
  nextLink: string = null;

  selectedAlbums: any = [];


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

  constructor(private route: ActivatedRoute,
              private albumService: ZMediaAlbumService,
              private photoService: ZMediaPhotoService,
              private confirmationService: ConfirmationService,
              private loadingService: LoadingService) {
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.getPhotos(+params['id']);
      this.getAlbumDetail(+params['id']);
    });
  }

  getAlbumDetail(id: number) {
    this.albumService.getAlbum(id).subscribe((res: any)=> {
      this.albumDetail = res.data;
    });
  }

  getPhotos(id: number) {
    this.albumService.getPhotosByAlbum(id).subscribe((res: any)=> {
      console.log(res);
      this.data = res.data;
      this.nextLink = res.page_metadata.links.next;
    });
  }

  onLoadMore() {
    if (this.nextLink) {
      this.albumService.loadMore(this.nextLink).subscribe((res: any)=> {
        _.map(res.data, (v: any)=> {
          this.data.push(v);
        });
        this.nextLink = res.page_metadata.links.next;
      });
    }
  }


  actionItem(event: any) {
    //console.log(event);
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
      case 'removeFromAlbum':
        this.onRemoveFromAlbum();
        break;
      case 'info':
        // call action from photoDetail
        this.photoDetail.preview(true);
        this.photoDetail.onShowInfo();
        break;
      case 'editInfo':
        // call action from photoDetail
        this.photoDetail.onEditInfo();
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

  actionUploading(event: any) {
    switch (event.action) {
      case 'addPhoto':
        /*_.map(event.data, (v: any)=> {
         this.data.unshift(v);
         });*/

        //reload data
        // this.getPhotos();

        break;
      default:
        break;
    }
  }


  // --- Action for Item --- //
  private onSelectedPhotos(item: any) {
    if (this.keyCtrl) {
      if (_.some(this.selectedAlbums, ['id', item.id])) {
        $('#photo-box-img-' + item.id).removeClass('selected');
        _.remove(this.selectedAlbums, ['id', item.id]);
      } else {
        $('#photo-box-img-' + item.id).addClass('selected');
        this.selectedAlbums.push(item);
      }
    } else {
      $('.row-img .photo-box-img').removeClass('selected');
      $('#photo-box-img-' + item.id).addClass('selected');
      this.selectedAlbums.length = 0;
      this.selectedAlbums.push(item);
      console.log(this.selectedAlbums);
    }
    this.hasFavourite = _.some(this.selectedAlbums, ['favorite', false]);
  }

  private onOneFavourite(item: any) {
    let findItemFavourite = _.findIndex(this.data, ['id', item.id]);
    this.photoService.actionOneFavourite(item).subscribe((res: any)=> {
      if (res.message === 'success') {
        this.data[findItemFavourite].favorite = (this.data[findItemFavourite].favorite) ? false : true;
      }
    });
  }

  // --- End Action for Item --- //

  private onFavourite() {
    // if there was one item's favorite is false, all item will be add to favorite
    let hasFavourite: boolean = _.some(this.selectedAlbums, ['favorite', false]);
    this.photoService.actionAllFavourite(this.selectedAlbums, hasFavourite).subscribe((res: any)=> {
      if (res.message === 'success') {
        _.map(this.selectedAlbums, (v: any)=> {
          v.favorite = hasFavourite;
        });
      }
    });
  }

  private onDelete() {
    let idPhotos = _.map(this.selectedAlbums, 'id'); // ['1','2'];
    this.confirmationService.confirm({
      message: 'Are you sure to delete ' + this.selectedAlbums.length + ' item' + (this.selectedAlbums.length > 1 ? 's' : '') + ' ?',
      accept: () => {
        let body = JSON.stringify({ids: idPhotos});
        this.loadingService.start();
        this.photoService.deletePhoto(body).subscribe((res: any)=> {
          _.map(idPhotos, (id: any)=> {
            _.remove(this.data, ['id', id]);
          });
          this.loadingService.stop();
        });
      }
    });
  }

  private onRemoveFromAlbum() {
    this.confirmationService.confirm({
        header: 'Remove photos from album',
        message: this.selectedAlbums.length + ' selected Items will be remove from ' + this.albumDetail.name + '. Removed items from album still remain in your library',
        accept: () => {
          this.loadingService.start();
          this.albumService.removeFromAlbum(this.albumDetail.id, this.selectedAlbums).subscribe(
            (res: any)=> {
              if (res.success) {
                _.map(this.selectedAlbums, (v: any)=> {
                  _.remove(this.data, ['id', v.id]);
                });
              }
              this.loadingService.stop();
            }
          );
        }
      }
    );
  }

  // --- End Action for Toolbar --- //
}
