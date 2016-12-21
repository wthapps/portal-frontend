import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
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

  onShow() {
    this.photoDetail.preview(true);
  }

  addPhoto(item: any) {
    if (_.find(this.selectedPhotos, ['id', item.id])) {
      _.remove(this.selectedPhotos, ['id', item.id]);

      $('#photo-box-img-' + item.id).removeClass('selected');

    } else {

      if (this.keyCtrl) {
        this.selectedPhotos.push(item);
      } else {
        $('.row-img .photo-box-img').removeClass('selected');
        this.selectedPhotos.length = 0;
        this.selectedPhotos.push(item);
      }

      $('#photo-box-img-' + item.id).addClass('selected');
    }
  }

}
