import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { ZMediaPhotoDetailComponent } from './photo-detail.component';
import { ZMediaPhotoService } from './photo.service';

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-media-photo-list',
  templateUrl: 'photo-list.component.html'
})
export class ZMediaPhotoListComponent implements OnInit {
  @ViewChild('photoDetail') photoDetail: ZMediaPhotoDetailComponent;

  data: any = [];
  nextLink: string = null;

  selectedPhotos: any = [];

  keyCtrl: boolean = false;
  hasFavourite: boolean = false;

  @HostListener('document:keydown', ['$event'])
  onKeyDown(ev: KeyboardEvent) {
    console.log(ev);
    if (ev.keyCode == 17 || ev.keyCode == 18 || ev.keyCode == 91 || ev.keyCode == 93 || ev.ctrlKey) this.keyCtrl = true;
  }

  @HostListener('document:keyup', ['$event'])
  onKeyUp(ev: KeyboardEvent) {
    if (ev.keyCode == 17 || ev.keyCode == 18 || ev.keyCode == 91 || ev.keyCode == 93 || ev.ctrlKey) this.keyCtrl = false;
  }

  constructor(private photoService: ZMediaPhotoService) {
  }

  ngOnInit() {
    this.photoService.listPhoto().subscribe((res: any)=> {
      this.data = res.data;
      this.nextLink = res.page_metadata.links.next;
    });
  }

  onLoadMore(event: any) {
    event.preventDefault();
    this.photoService.loadMore(this.nextLink).subscribe((res: any)=> {
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
        this.onPreviewAll(event.data);
        break;
      default:
        break;
    }
  }

  actionToolbar(event: any) {
    console.log(event);
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

        break;
      case 'info':

        break;
      case 'addToAlbum':

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

  // --- End Action for Item --- //


  // --- Action for Toolbar --- //
  private onPreview() {
    console.log('Toolbar onPreview', this.selectedPhotos);
    if (this.selectedPhotos.length > 1) {
      this.photoDetail.selectedPhotos = this.selectedPhotos;
    } else {
      this.photoDetail.index = _.findIndex(this.photoDetail.allPhotos, ['id', this.selectedPhotos[0].id]);
      console.log('Toolbar this.photoDetail.index', this.photoDetail.index);
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

  // --- End Action for Toolbar --- //
}
