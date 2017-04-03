import { Component, OnInit, HostListener, ViewChild } from '@angular/core';

import { ConfirmationService } from 'primeng/components/common/api';

import { ZMediaPhotoDetailComponent } from './photo-detail.component';
import { ZMediaPhotoService } from './photo.service';
import { LoadingService } from '../../core/partials/loading/loading.service';
import { ActivatedRoute } from '@angular/router';
import { ZMediaToolbarComponent } from '../shared/toolbar/toolbar.component';

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-media-photo-list',
  templateUrl: 'photo-list.component.html'
})
export class ZMediaPhotoListComponent implements OnInit {
  @ViewChild('photoDetail') photoDetail: ZMediaPhotoDetailComponent;
  @ViewChild('mediaToolbar') mediaToolbar: ZMediaToolbarComponent;

  data: any = [];
  nextLink: string = null;

  selectedPhotos: any = [];

  keyCtrl: boolean = false;
  hasFavourite: boolean = false;
  currentView: string = 'grid';

  photoIsEmpty: boolean = false;

  @HostListener('document:keydown', ['$event'])
  onKeyDown(ev: KeyboardEvent) {
    // console.log(ev);
    if (ev.keyCode == 17 || ev.keyCode == 18 || ev.keyCode == 91 || ev.keyCode == 93 || ev.ctrlKey) this.keyCtrl = true;
  }

  @HostListener('document:keyup', ['$event'])
  onKeyUp(ev: KeyboardEvent) {
    if (ev.keyCode == 17 || ev.keyCode == 18 || ev.keyCode == 91 || ev.keyCode == 93 || ev.ctrlKey) this.keyCtrl = false;
  }

  constructor(private photoService: ZMediaPhotoService,
              private confirmationService: ConfirmationService,
              private route: ActivatedRoute,
              private loadingService: LoadingService) {

    this.route.queryParams.subscribe(
      (queryParams: any) => {
        this.hasFavourite = queryParams['favorite'];
        if (this.hasFavourite)
          this.getPhotos({'favorite': true});
        else
          this.getPhotos();
        // this.isMember = true; // testing
      }
    );
  }

  ngOnInit() {
    // this.getPhotos();
  }

  getPhotos(body: any = {}) {
    this.photoService.listPhoto(body).subscribe((res: any)=> {
      this.data = res.data;
      this.nextLink = res.page_metadata.links.next;
      if (res.data.length == 0) {
        this.photoIsEmpty = true;
      }
    });
  }

  onLoadMore() {
    if (this.nextLink) {
      this.photoService.loadMore(this.nextLink).subscribe((res: any)=> {
        _.map(res.data, (v: any)=> {
          this.data.push(v);
        });
        this.nextLink = res.page_metadata.links.next;
      });
    }
  }


  actionItem(event: any) {
    switch (event.action) {
      case 'select':
        this.onSelectedPhotos(event.data);
        break;
      case 'previewAll':
        this.onPreviewAll(event.data);
        break;
      case 'editName':
        this.onOneEditName(event.data);
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
      case 'preview':
        this.onPreview();
        break;
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
        this.getPhotos();

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
    this.photoDetail.selectedPhotos = this.photoDetail.allPhotos;
    this.photoDetail.index = _.findIndex(this.photoDetail.allPhotos, ['id', item.id]);
    this.photoDetail.preview(true);
  }

  private onOneFavourite(item: any) {
    let findItemFavourite = _.findIndex(this.data, ['id', item.id]);
    this.photoService.actionOneFavourite(item).subscribe((res: any)=> {
      if (res.message === 'success') {
        this.data[findItemFavourite].favorite = (this.data[findItemFavourite].favorite) ? false : true;
      }
    });
  }

  private onOneEditName(item: any) {
    // console.log(item);
    this.selectedPhotos.length = 0;
    this.selectedPhotos.push(item);
    this.mediaToolbar.formEditName.modal.open();
  }

  // --- End Action for Item --- //


  // --- Action for Toolbar --- //
  private onPreview() {
    if (this.selectedPhotos.length > 1) {
      this.photoDetail.selectedPhotos = this.selectedPhotos;
      this.photoDetail.index = this.selectedPhotos.length - 1;
    } else {
      this.photoDetail.index = _.findIndex(this.photoDetail.allPhotos, ['id', this.selectedPhotos[0].id]);
      this.photoDetail.selectedPhotos = this.photoDetail.allPhotos;
    }
    this.photoDetail.preview(true);
  }

  private onFavourite() {
    // if there was one item's favorite is false, all item will be add to favorite
    let hasFavourite: boolean = _.some(this.selectedPhotos, ['favorite', false]);
    this.photoService.actionAllFavourite(this.selectedPhotos, hasFavourite).subscribe((res: any)=> {
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
        this.photoService.deletePhoto(body).subscribe((res: any)=> {
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
