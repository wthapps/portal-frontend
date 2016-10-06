import {Component, AfterViewInit, OnDestroy, Input, OnChanges, SimpleChange} from '@angular/core';
import {ROUTER_DIRECTIVES, ActivatedRoute} from '@angular/router';
import {Photo} from '../../../shared/models/photo.model';
import {ApiBaseService} from '../../../shared/services/apibase.service';
import {LoadingService} from '../../../partials/loading/loading.service';
import {ZPictureGridComponent} from '../shared/grid.component';
import {ZPictureListComponent} from '../shared/list.component';

declare var wheelzoom: any;
declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'page-zone-album-detail',
  templateUrl: 'album-detail.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    ZPictureGridComponent,
    ZPictureListComponent,
  ]
})

export class ZAlbumDetailComponent implements AfterViewInit, OnDestroy, OnChanges {

  currentPage: number = 1;
  perPage: number = 1;
  total: number = 1;
  isGridView: boolean;
  isListView: boolean;
  @Input() pageView: string = 'grid';
  photos: Array<Photo> = [];
  errorMessage: string = '';
  albumId:number;

  constructor(private apiService: ApiBaseService,
              private route: ActivatedRoute,
              private loadingService: LoadingService) {
    this.route.params.subscribe(params => {
      this.albumId = params['id'];
    });
  }

  ngOnInit() {
    if (this.pageView == 'grid') {
      this.isGridView = true;
      this.isListView = false;
    } else if (this.pageView == 'list') {
      this.isGridView = false;
      this.isListView = true;
    }
    this.getPhotos(this.currentPage);
  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}): void {
    
  }

  ngAfterViewInit() {

  }

  ngOnDestroy() {

  }



  getPhotos(page: any) {
    if (this.currentPage <= Math.ceil(this.total / this.perPage)) {
      this.loadingService.start('#photodata-loading');
      this.apiService.get(`zone/photos?page=${page}&album=${this.albumId}`).subscribe(
        (response: any) => {
          this.perPage = response.per_page;
          this.total = response.total;
          this.photos = _.concat(this.photos, response.data);
          this.loadingService.stop('#photodata-loading');
        },
        error => {
          this.errorMessage = <any>error;
          this.loadingService.stop('#photodata-loading');
        }
      );
    }
  }

}
