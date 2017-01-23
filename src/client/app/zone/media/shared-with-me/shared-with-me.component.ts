import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { ZMediaSharedWithMeService } from './shared-with-me.service';

// import { LoadingService, ConfirmationService } from '../../../shared/index';

// declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-media-shared-with-me',
  templateUrl: 'shared-with-me.html'
})
export class ZMediaSharedWithMeComponent implements OnInit {
  data: any = [];
  nextLink: string = null;

  selectedPhotos: any = [];

  hasFavourite: boolean = false;
  currentView: string = 'grid';

  constructor(private sharedWithMeService: ZMediaSharedWithMeService) {
  }

  ngOnInit() {
    this.sharedWithMeService.list().subscribe((res: any)=> {
      this.data = res.data;
      // this.nextLink = res.page_metadata.links.next;
    });
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
