import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { ZMediaSharedWithMeService } from './shared-with-me.service';
import { ZMediaPhotoDetailComponent } from '../photo/photo-detail.component';
import { ZMediaPhotoService } from '../photo/photo.service';
import { Router, ActivatedRoute } from '@angular/router';

declare var $: any;
declare var _: any;

export const ActionItemType = {
  select: 'select',
  previewAll: 'previewAll',
  favourite: 'favourite'
};

@Component({
  moduleId: module.id,
  selector: 'z-media-shared-with-me',
  templateUrl: 'shared-with-me.component.html'
})
export class ZMediaSharedWithMeComponent implements OnInit {
  @ViewChild('photoDetail') photoDetail: ZMediaPhotoDetailComponent;

  data: any = [];
  nextLink: string = null;
  sharingUuid: string;

  selectedPhotos: any = [];
  selectedAlbums: any = [];

  keyCtrl: boolean = false;
  hasFavourite: boolean = false;
  currentView: string = 'grid';

  shareIsEmpty:boolean = false;

  @HostListener('document:keydown', ['$event'])
  onKeyDown(ev: KeyboardEvent) {
    console.log(ev);
    if (ev.keyCode == 17 || ev.keyCode == 18 || ev.keyCode == 91 || ev.keyCode == 93 || ev.ctrlKey) this.keyCtrl = true;
  }

  @HostListener('document:keyup', ['$event'])
  onKeyUp(ev: KeyboardEvent) {
    if (ev.keyCode == 17 || ev.keyCode == 18 || ev.keyCode == 91 || ev.keyCode == 93 || ev.ctrlKey) this.keyCtrl = false;
  }

  constructor(private photoService: ZMediaPhotoService,
              private route: ActivatedRoute,
              private router: Router,
              private sharedWithMeService: ZMediaSharedWithMeService) {

    this.route.queryParams
      .switchMap((queryParams: any) => this.sharedWithMeService.list(queryParams['uuid']))
      .subscribe((res: any) => {
        this.data = res['data'];
        if (res.data.albums.length == 0 && res.data.photos.length == 0) {
          this.shareIsEmpty = true;
        }
    });
  }

  ngOnInit() {
    // this.sharedWithMeService.list().subscribe((res: any)=> {
    //   this.data = res.data;
    //   // this.nextLink = res.page_metadata.links.next;
    // });
  }

  onLoadMore(event: any) {
    event.preventDefault();
    this.sharedWithMeService.loadMore(this.nextLink).subscribe((res: any)=> {
      _.map(res.data, (v: any)=> {
        this.data.push(v);
      });
      // this.nextLink = res.page_metadata.links.next;
    });
  }

  actionItem(event: any) {
    //console.log(event);
    switch (event.action) {
      case 'select':
        this.onSelectedPhotos(event.data);
        break;
      case 'previewAll':
        if(event.type === 'photo')
          this.onPreviewAll(event.data);
        else
          this.router.navigate([`shared-with-me/album`, event.data.id], { queryParams: {'sharedWithMe': true}} );
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
    this.photoDetail.selectedPhotos = this.photoDetail.allPhotos;
    this.photoDetail.index = _.findIndex(this.photoDetail.allPhotos, ['id', item.id]);
    this.photoDetail.open({show: true});
  }

  private onOneFavourite(item: any) {
    let findItemFavourite = _.findIndex(this.data.photos, {'id': item.id});
    this.photoService.actionOneFavourite(item).subscribe((res: any)=> {
      if (res.message === 'success') {
        this.data.photos[findItemFavourite].favorite = (this.data.photos[findItemFavourite].favorite) ? false : true;
      }
    });
  }

  // --- End Action for Item --- //
}
