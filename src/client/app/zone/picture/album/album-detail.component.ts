import {Component, AfterViewInit, OnDestroy, Input, OnChanges, SimpleChange} from '@angular/core';
import {ROUTER_DIRECTIVES, ActivatedRoute} from '@angular/router';
import {Photo} from '../../../shared/models/photo.model';
import {ApiBaseService} from '../../../shared/services/apibase.service';
import {LoadingService} from '../../../partials/loading/loading.service';
import {ZPictureGridComponent} from '../shared/grid.component';
import {ZPictureListComponent} from '../shared/list.component';
import {AlbumService} from "../../../shared/services/picture/album.service";
import {Album} from "../../../shared/models/album.model";
import {ZPictureBarAlbumComponent} from "../shared/bar-album-control.component";
import {ZPicturePhotoTimelineComponent} from "../shared/timeline-photo.component";

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
    ZPicturePhotoTimelineComponent,
    ZPictureBarAlbumComponent,
  ]
})

export class ZAlbumDetailComponent implements AfterViewInit, OnDestroy, OnChanges {

  currentPage: number = 1;
  perPage: number = 1;
  total: number = 1;
  pageView: string = 'grid';
  photos: Array<Photo> = [];
  errorMessage: string = '';
  album: Album;

  constructor(private apiService: ApiBaseService,
              private route: ActivatedRoute,
              private loadingService: LoadingService,
              private albumService: AlbumService) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.albumService.getAlbumFromApi(params['id'], (res:any) => {
        this.albumService.setAlbum(new Album(res.album));
        this.album = this.albumService.getAlbum();
        this.getPhotos(this.currentPage);
      });
    });
    console.log(this.pageView);
  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}): void {
    // comment
  }

  ngAfterViewInit() {
    // comment
  }

  ngOnDestroy() {
    // comment
  }

  getPhotos(page: any) {
    if (this.currentPage <= Math.ceil(this.total / this.perPage)) {
      this.loadingService.start('#photodata-loading');
      this.album = this.albumService.getAlbum();
      this.apiService.get(`zone/photos?page=${page}&album=${this.album.id}`).subscribe(
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

  onViewChanged(event:any) {
    this.pageView = event;
  }

  onImgsSelected(event: any) {
    // let _this_photos = this;
    // this.dataSelectedPhotos = [];
    // _.map(event, function (v) {
    //   _this_photos.dataSelectedPhotos.push(_.find(_this_photos.photos, ['id', v]));
    // });
    // this.selectedPhotos.emit(event);
    // this.selectedPhotoFull.emit(this.dataSelectedPhotos);
  }

  onViewInfo(event:any) {
    // if (this.showInfo) {
    //   $('#photo-box-detail').removeClass('active-info');
    // } else {
    //   $('#photo-box-detail').addClass('active-info');
    // }
    // this.showInfo = (this.showInfo == true ? false : true);
    $('#photo-box-detail').addClass('active-info');
  }
}
