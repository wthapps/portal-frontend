import {
  Component, OnInit, AfterViewInit, OnDestroy, OnChanges, Output,
  EventEmitter, ViewChild
} from '@angular/core';
import { ApiBaseService } from '../../../shared/services/apibase.service';
import { BaseMediaComponent } from '../../shared/media/base-media.component';
import { MediaType } from '../../../shared/config/constants';
import { AlbumService } from '../../../shared/services/picture/album.service';
import { Album } from '../../../shared/models/album.model';
import { PhotoService } from '../../../shared/services/picture/photo.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '../../../partials/loading/loading.service';
import { ConfirmationService } from 'primeng/components/common/api';
import { ToastsService } from '../../../partials/toast/toast-message.service';
import { Photo } from '../../../shared/models/photo.model';
import { ZPictureFormEditAlbumComponent } from '../../shared/form/form-edit-album.component';

declare var wheelzoom: any;
declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'page-zone-album-detail',
  templateUrl: 'album-detail.component.html',
  styleUrls: ['album.component.css'],
})

export class ZAlbumDetailComponent extends BaseMediaComponent implements OnInit,OnChanges, AfterViewInit, OnDestroy {

  album: Album = new Album(null);
  albumId: number;
  selectedItems: Array<any> = new Array<any>();

  @Output() selectedPhotos: EventEmitter<Array<number>> = new EventEmitter<Array<number>>();
  @Output() selectedPhotoFull: EventEmitter<Array<Photo>> = new EventEmitter<Array<Photo>>();
  @ViewChild(ZPictureFormEditAlbumComponent) formEditAlbum: ZPictureFormEditAlbumComponent;


  constructor(public apiService?: ApiBaseService,
              public albumService?: AlbumService,
              public photoService?: PhotoService,
              public route?: ActivatedRoute,
              public loadingService?: LoadingService,
              public router?: Router,
              public toastsService?: ToastsService,
              public confirmationService?: ConfirmationService,) {
    super(MediaType.albumDetail, apiService);
  }

  ngOnInit() {

    this.route.params.subscribe(params => {
      this.albumId = params['id'];
      this.init();
    });
  }

  ngOnChanges() {
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

  onViewChanged(event: any) {
    this.pageView = event;
  }

  onCloseInfo() {
    this.onOffInfo();
  }

  onViewInfo(event: any) {
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
            .subscribe(res => {
              this.loadingService.stop();
              this.router.navigate(['/zone/picture/album']);
            });
        }
      }
    );
  }

  onEditAction() {
    this.formEditAlbum.show();
  }

  onFormResult(res: any) {

  }

  onHideModal() {
    this.formEditAlbum.hide();
  }

  onDoneEditAlbumFormModal(album: Album) {
    this.formEditAlbum.hide();
    this.album = album;
  }

  toggleModal(event: any, type: string) {
    this.selectedItems = [];
    this.selectedItems.push(event);
    super.toggleModal(event, type);
  }

  updateDetails(item: any) {
    this.album = item;
  }

  onRemoveAction() {
    let ids = _.map(this.selectedItems, 'id');
    if (ids.length > 0) {
      this.confirmationService.confirm({
          header: 'Remove photos from album',
          message: ids.length + ' selected Items will be remove from ' + this.album.name + '. Removed items from album still remain in your library',
          accept: () => {
            this.loadingService.start();
            this.albumService.post(this.albumService.url + this.album.id + '/photos', {photos: ids, type: 'delete'})
              .subscribe(res => {
                this.loadingService.stop();
                this.toastsService.success('Items are removed from album');
                this.items = res.data;
              });
          }
        }
      );
    }
  }
}
