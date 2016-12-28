import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { ZMediaFavoriteService } from './favourites.service';

// import { LoadingService, ConfirmationService } from '../../../shared/index';

// declare var $: any;
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

  hasFavourite: boolean = false;
  currentView: string = 'grid';

  constructor(private favoriteService: ZMediaFavoriteService) {
  }

  ngOnInit() {
    this.favoriteService.list().subscribe((res: any)=> {
      this.data = res.data;
      // this.nextLink = res.page_metadata.links.next;
    });
  }

  onLoadMore(event: any) {
    event.preventDefault();
    this.favoriteService.loadMore(this.nextLink).subscribe((res: any)=> {
      _.map(res.data, (v: any)=> {
        this.data.push(v);
      });
      // this.nextLink = res.page_metadata.links.next;
    });
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
}
