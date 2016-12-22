import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { ZMediaService } from '../media.service';
import { ZMediaPhotoDetailComponent } from './photo-detail.component';

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

  constructor(private mediaService: ZMediaService) {
  }

  ngOnInit() {
    this.mediaService.listPhoto().subscribe((res: any)=> {
      this.data = res.data;
      this.nextLink = res.page_metadata.links.next;
    });
  }

  onLoadMore(event: any) {
    event.preventDefault();
    this.mediaService.loadMore(this.nextLink).subscribe((res: any)=> {
      _.map(res.data, (v: any)=> {
        this.data.push(v);
      });
      this.nextLink = res.page_metadata.links.next;
    });
  }

  onSelectedPhotos(item: any) {
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
    }
    this.hasFavourite = _.some(this.selectedPhotos, ['favorite', false]);
  }

  actionPhotos(event: any) {
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

  private onPreview() {
    console.log(this);
    this.photoDetail.preview(true);
  }


  private onFavourite() {
    // if there was one item's favorite is false, all item will be add to favorite
    let hasFavourite: boolean = _.some(this.selectedPhotos, ['favorite', false]);
    this.mediaService.actionAllFavourite('photo', this.selectedPhotos, hasFavourite).subscribe((res: any)=> {
      if (res.message === 'success') {
        _.map(this.selectedPhotos, (v: any)=> {
          v.favorite = hasFavourite;
        })
      }
    });
  }

}
