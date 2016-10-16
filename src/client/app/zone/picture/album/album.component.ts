import {Component, Input, OnInit, OnChanges, SimpleChanges, ElementRef} from '@angular/core';

import {ZPictureBarComponent} from '../shared/bar-control.component';
import {ZAlbumGridComponent} from '../shared/grid_album.component';
import {Album} from '../../../shared/models/album.model';
import {ApiBaseService, LoadingService} from '../../../shared/index';
import {ZAlbumListComponent} from '../shared/list_album.component';
import {BaseMediaComponent} from "../../shared/media/base-media.component";
import {MediaType} from "../../../shared/config/constants";

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'page-zone-album',
  templateUrl: 'album.component.html',
})

export class ZAlbumComponent extends BaseMediaComponent implements OnInit, OnChanges {

  dataAlbums: Array<Album> = [];
  currentPage: number = 1;
  perPage: number = 1;
  total: number = 1;
  errorMessage: string = '';

  isGridView: boolean;
  isListView: boolean;
  @Input() pageView: string = 'grid';

  constructor(private apiService: ApiBaseService) {
    super(MediaType.photo, apiService);
  }

  ngOnInit() {
    // if (this.pageView == 'grid') {
    //   this.isGridView = true;
    //   this.isListView = false;
    // } else if  (this.pageView == 'list') {
    //   this.isGridView = false;
    //   this.isListView = true;
    // }
    // this.getAlbum(this.currentPage);
  }

  ngAfterViewInit() {
    // let win = $(window);
    // let _this = this;
    //
    // // Each time the user scrolls
    // win.scroll(function () {
    //   // End of the document reached?
    //   if ($(document).height() - win.height() == win.scrollTop()) {
    //     _this.currentPage = _this.currentPage + 1;
    //     _this.getAlbum(_this.currentPage);
    //   }
    // });
  }

  ngOnChanges(changes: SimpleChanges) {
    // if (changes['pageView'].currentValue) {
    //   var view = changes['pageView'].currentValue;
    //   if (view == 'grid') {
    //     this.isGridView = true;
    //     this.isListView = false;
    //   } else if  (view == 'list') {
    //     this.isGridView = false;
    //     this.isListView = true;
    //   }
    // }
  }

  // getAlbum(page:any) {
  //   if (this.currentPage <= Math.ceil(this.total / this.perPage)) {
  //     // this.loadingService.start(this.elementRef, '#album-data-loading');
  //     this.apiService.get(`zone/albums?page=${page}`).subscribe(
  //       (response: any) => {
  //         this.perPage = response.per_page;
  //         this.total = response.total;
  //         this.dataAlbums = _.concat(this.dataAlbums, response.data);
  //         // this.loadingService.stop(this.elementRef, '#album-data-loading');
  //       },
  //       error => {
  //         this.errorMessage = <any>error;
  //         // this.loadingService.stop(this.elementRef, '#album-data-loading');
  //       }
  //     );
  //   }
  // }

  onPageView(view: string) {
    // this.pageView = view;
  }

}
