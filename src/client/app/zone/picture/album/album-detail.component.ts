import {Component, AfterViewInit, OnDestroy, Input, OnChanges, SimpleChange, ElementRef} from '@angular/core';
import {ApiBaseService} from '../../../shared/services/apibase.service';
import {BaseMediaComponent} from "../../shared/media/base-media.component";
import {MediaType} from "../../../shared/config/constants";
import {AlbumService} from "../../../shared/services/picture/album.service";
import {Album} from "../../../shared/models/album.model";
import {PhotoService} from "../../../shared/services/picture/photo.service";
import {ActivatedRoute, Router} from "@angular/router";
import {LoadingService} from "../../../partials/loading/loading.service";
import {ConfirmationService} from "primeng/components/common/api";

declare var wheelzoom: any;
declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'page-zone-album-detail',
  templateUrl: 'album-detail.component.html',
  styleUrls: ['album.component.css'],
})

export class ZAlbumDetailComponent extends BaseMediaComponent{

  album: Album = new Album(null);
  albumId: number;

  constructor(
    private apiService?: ApiBaseService,
    private albumService?: AlbumService,
    private photoService?: PhotoService,
    private route?: ActivatedRoute,
    private loadingService?: LoadingService,
    private router: Router,
    private confirmationService?: ConfirmationService
  ) {
    super(MediaType.albumDetail, apiService);
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.albumId = params['id'];
      this.init();
    });
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


  init() {
    this.albumService.get(this.albumService.url + this.albumId).subscribe(
      (res: any) => {
        this.album = new Album(res.data);
        this.getPhotosByAlbum();
      },
    );
  }

  getPhotosByAlbum() {
    let params = this.photoService.paramsToString({page: this.currentPage, album: this.album.id});
    this.loadItemsByUrl(this.photoService.url + '?' + params);
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

  onCloseInfo() {
    this.onOffInfo();
  }
  onViewInfo(event:any) {
    this.onOffInfo();
  }

  onOffInfo() {
    $('.two-layout-slip').toggleClass('active-info');
  }

  onDeleteAction() {
    this.confirmationService.confirm({
      header: 'Delete Album',
      message: this.album.name + ' will be deleted permanently. Photos that were in a deleted album remain part of your Photos library',
      accept: () => {
        this.loadingService.start();
        this.albumService.delete(this.albumService.url + this.album.id)
          .map(res => res.json())
          .subscribe(res => {
              this.loadingService.stop();
              this.router.navigate(['/zone/picture/album']);
          })
        }
      }
    )
  }
}
