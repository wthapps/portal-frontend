import {Component, AfterViewInit, OnDestroy, Input, OnChanges, SimpleChange, ElementRef} from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import {Photo} from '../../../shared/models/photo.model';
import {ApiBaseService} from '../../../shared/services/apibase.service';
import {LoadingService} from '../../../partials/loading/loading.service';
import {AlbumService} from "../../../shared/services/picture/album.service";
import {Album} from "../../../shared/models/album.model";
import {BaseMediaComponent} from "../../shared/media/base-media.component";
import {MediaType} from "../../../shared/config/constants";

declare var wheelzoom: any;
declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'page-zone-album-detail',
  templateUrl: 'album-detail.component.html',
})

export class ZAlbumDetailComponent extends BaseMediaComponent{

  constructor(private apiService: ApiBaseService) {
    super(MediaType.albumDetail, apiService);
  }

  ngOnInit() {
    console.log('bbbbbbbbbbbb');
    super.ngOnInit()
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
    // if (this.currentPage <= Math.ceil(this.total / this.perPage)) {
    //   // this.loadingService.start(this.elementRef, '#photodata-loading');
    //   this.album = this.albumService.getAlbum();
    //   this.apiService.get(`zone/photos?page=${page}&album=${this.album.id}`).subscribe(
    //     (response: any) => {
    //       this.perPage = response.per_page;
    //       this.total = response.total;
    //       this.photos = _.concat(this.photos, response.data);
    //       // this.loadingService.stop(this.elementRef, '#photodata-loading');
    //     },
    //     error => {
    //       this.errorMessage = <any>error;
    //       // this.loadingService.stop(this.elementRef, '#photodata-loading');
    //     }
    //   );
    // }
  }

  onViewChanged(event:any) {
    // this.pageView = event;
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
    // this.showInfo = (this.showInfo == true ? false : true);
    // $('.two-layout-slip').toggleClass('active-info');
  }
}
