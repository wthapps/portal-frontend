import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { ZMediaFavoriteService } from './favourites.service';

// import { LoadingService, ConfirmationService } from '../../../shared/index';

// declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-media-favourites-detail',
  templateUrl: 'favourites-detail.component.html'
})
export class ZMediaFavoriteDetailComponent implements OnInit {
  data: any = [];
  nextLink: string = null;

  selectedPhotos: any = [];

  hasFavourite: boolean = false;
  currentView: string = 'grid';

  type: string = '';

  constructor(private favoriteService: ZMediaFavoriteService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.type = params['category'];
    });


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

  actionAlbumItem(event: any) {
    switch (event.action) {
      case 'previewAll':
        console.log(event);
        this.router.navigate(['/album', event.data.id]);
        break;
      default:
        break;
    }
  }

  actionPhotoItem(event: any) {
    console.log(event);
  }
}
