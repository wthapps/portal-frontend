import { Component, OnDestroy, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {
  ApiBaseService,
  CommonEventService,
  PhotoService,
  UserService
} from '@wth/shared/services';
import { BasePhotoDetailComponent } from '@wth/shared/shared/components/photo/detail/base-photo-detail.component';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';
import { LoadingService } from '@wth/shared/shared/components/loading/loading.service';
import { AlbumCreateModalComponent } from '@media/shared/modal';
import { PhotoEditModalComponent } from '@wth/shared/shared/components/photo/modal/photo/photo-edit-modal.component';
import { MediaRenameModalComponent } from '@wth/shared/shared/components/photo/modal/media/media-rename-modal.component';
import { SharingModalComponent } from '@wth/shared/shared/components/photo/modal/sharing/sharing-modal.component';
import { TaggingModalComponent } from '@wth/shared/shared/components/photo/modal/tagging/tagging-modal.component';
import { AddToAlbumModalComponent } from '@wth/shared/shared/components/photo/modal/photo/add-to-album-modal.component';
import { Location } from '@angular/common';
import { Constants } from '@shared/constant';
import { Mixin } from '@shared/design-patterns/decorator/mixin-decorator';
import { SharingModalService } from '@shared/shared/components/photo/modal/sharing/sharing-modal.service';
import { ToastsService } from '@shared/shared/components/toast/toast-message.service';
import { SharingModalResult } from '@shared/shared/components/photo/modal/sharing/sharing-modal';
import { MediaModalMixin } from '@media/shared/mixin/media-modal.mixin';
import { MediaDownloadMixin } from '@media/shared/mixin/media-download.mixin';
import { SharingModalMixin } from '@shared/shared/components/photo/modal/sharing/sharing-modal.mixin';
import { MediaAdditionalListMixin } from '@media/shared/mixin/media-additional-list.mixin';
import { ImageCropperModule } from '@shared/shared/components/image-cropper/image-cropper.module';
import * as Cropper from 'cropperjs';
import { AlbumAddMixin } from '@media/shared/mixin/album/album-add.mixin';
import { MediaAddModalService } from '@shared/shared/components/photo/modal/media/media-add-modal.service';
import { MediaCreateModalService } from '@shared/shared/components/photo/modal/media/media-create-modal.service';
import { mediaConstants } from '@media/shared/conig/constants';
import { MediaPreviewMixin } from '@media/shared/mixin/media-preview.mixin';
import { DoublyLinkedLists } from '@shared/data-structures/link-list/doubly-linked-lists';
@Mixin([MediaAdditionalListMixin, SharingModalMixin, MediaDownloadMixin, MediaModalMixin, AlbumAddMixin, MediaPreviewMixin])
@Component({
  selector: 'photo-detail',
  templateUrl: '../shared/list/item-detail.component.html',
  styleUrls: ['photo-detail.component.scss'],
})
export class PhotoDetailComponent implements OnInit,
  MediaAdditionalListMixin,
  SharingModalMixin,
  MediaDownloadMixin,
  MediaPreviewMixin,
  MediaModalMixin,
  AlbumAddMixin {
  object: any;
  tooltip: any = Constants.tooltip;
  menuActions: any = {};
  subShareSave: any;
  selectedObjects: any;
  showDetailsInfo: any = false;
  modalIns: any;
  modalRef: any;
  loading: any;
  image: any;
  cropper: any;
  loadingImg: any;
  hasEditPhoto: any;
  subAddAlbum: any;
  subOpenCreateAlbum: any;
  subCreateAlbum: any;
  returnUrl: any;
  listIds: DoublyLinkedLists;
  @ViewChild('modalContainer', { read: ViewContainerRef }) modalContainer: ViewContainerRef;

  constructor(public apiBaseService: ApiBaseService,
    public route: ActivatedRoute,
    public router: Router,
    public resolver: ComponentFactoryResolver,
    public sharingModalService: SharingModalService,
    public toastsService: ToastsService,
    public confirmService: WthConfirmService,
    public photoService: PhotoService,
    public mediaAddModalService: MediaAddModalService,
    public mediaCreateModalService: MediaCreateModalService,
    public location: Location) { }

  ngOnInit() {
    this.menuActions = this.getMenuActions();

    this.route.params.subscribe(p => {
      this.route.queryParams.subscribe(params => {
        this.apiBaseService.get(`media/media/${p.id}`, { model: 'Media::Photo' }).subscribe(res => {
          this.object = res.data;
          if (this.object.favorite) {
            this.menuActions.favorite.iconClass = 'fa fa-star';
          } else {
            this.menuActions.favorite.iconClass = 'fa fa-star-o';
          }
          this.validateActions(this.menuActions, this.object.permission.role_id);
          if (!this.listIds && params.preview) {
            if (params.ids) {
              this.listIds = new DoublyLinkedLists(params.ids.split(','));
              this.listIds.setCurrent(this.object.id);
            } else {
              let query: any = { model: 'Media::Photo' }
              if (params.parent_id) query.parent = params.parent_id;
              this.apiBaseService.get(`media/media/ids`, query).subscribe(res => {
                if (res.data) {
                  this.listIds = new DoublyLinkedLists(res.data.map(d => d.uuid));
                  this.listIds.setCurrent(this.object.uuid);
                }
              });
            }
          }
          if (params.returnUrl) this.returnUrl = params.returnUrl;
          // this.onStart();
        });
      });
    });
    // const readURL: any = (input) => {
    //   if (input.files && input.files[0]) {
    //     var reader = new FileReader();

    //     reader.onload = function (e: any) {
    //       $('#image-viewer').attr('src', e.target.result);
    //     }
    //     reader.readAsDataURL(input.files[0]);
    //   }
    // }
    // $("#image-viewer").change(() => {
    //   console.log('change');

    //   readURL(this);
    // });
  }
  validateActions: (menuActions: any, role_id: number) => any;

  openModalShareCustom() {
    this.openModalShare([this.object]);
  }
  openModalShare: (input: any) => void;
  onSaveShare(input: any) {
    const data: any = {
      objects: [this.object].map(s => { return { id: s.id, model: s.model } }),
      recipients: input.users,
      role_id: input.role.id
    };

    this.apiBaseService.post('media/sharings', data).subscribe(res => {
      this.sharingModalService.update.next(res.data);
    });
  }
  onEditShare: (e: SharingModalResult, sharing: any) => void;

  downloadMedia: (media: any) => void;
  loadModalComponent: (component: any) => void;

  openEditModal: (object: any) => void;
  onAfterEditModal() {
    this.modalIns.event.subscribe(e => {
      switch (e.action) {
        case 'editInfo':
          this.apiBaseService.put(`media/photos/${this.object.id}`, e.params.selectedObject).subscribe(res => {
            this.object = res.data;
          });
          break;
        default:
          break;
      }
    });
  }

  onStart(event?: any) {
    this.image =
    event && event.path
    ? event.path[0]
    : document.getElementById('image-viewer');
    if (this.cropper) {
      if (this.cropper.url !== $('#image-viewer').attr('src')) {
        this.cropper.replace($('#image-viewer').attr('src'));
      }
    } else {
      this.cropper = new Cropper(this.image, {
        autoCrop: false,
        // dragMode: 'move',
        dragMode: 'none',
        background: false,
        viewMode: 1, // restrict the crop box to not exceed the size of the canvas.
        ready: () => {
          setTimeout(() => {
            this.loadingImg = false;
          }, 200);
        },
        zoom: (e: any) => {
          if (e.detail.ratio !== e.detail.oldRatio) {
            this.cropper.setDragMode('move');
          }
        }
      });
    }
  }

  onZoomIn() {
    this.cropper.zoom(0.1);
  }

  onZoomOut() {
    this.cropper.zoom(-0.1);
  }

  onRefresh() {
    this.cropper.reset();
    this.cropper.setDragMode('none');
  }

  doAction(event: any) {
    switch (event.action) {
      case 'editPhoto':
        this.editPhoto();
        break;
      case 'cancelEdit':
        this.hasEditPhoto = false;
        break;
      case 'savePhoto':
        this.savePhoto(event.data);
        break;
      default:
        break;
    }
    return false;
  }

  private editPhoto() {
    this.hasEditPhoto = true;
    // this.event.emit({action: 'editPhoto'});
  }

  private savePhoto(dataImg: any) {
    this.photoService.confirmUpdate(this.object, dataImg).then((data: any) => {
      // this.event.emit({ action: 'photoUpdated', payload: data });
      // this.object.url = `${data.url}?t=${+new Date()}`;
      this.object.url = `${data.url}`;
      $('.cropper-canvas')[0].childNodes[0].src = this.object.url;

      this.hasEditPhoto = false;
    });
  }

  openModalAddToAlbum:(selectedObjects: any) => void;
  onAddToAlbum:(e: any) => void;
  openCreateAlbumModal:(selectedObjects: any) => void;
  onDoneAlbum:(e: any) => void;
  onAddedToAlbum: (data: any) => void;

  getMenuActions() {
    return {
      // active_drop: true,
      share: {
        active: true,
        permission: mediaConstants.SHARING_PERMISSIONS.OWNER,
        inDropDown: false, // Outside dropdown list
        action: this.openModalShareCustom.bind(this),
        class: 'btn btn-default',
        liclass: 'hidden-xs',
        tooltip: this.tooltip.share,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-share-alt'
      },
      favorite: {
        active: true,
        permission: mediaConstants.SHARING_PERMISSIONS.VIEW,
        inDropDown: false, // Outside dropdown list
        action: () => {
          this.apiBaseService.post(`media/favorites/toggle`, {
            objects: [this.object]
              .map(v => { return { id: v.id, object_type: v.model } })
          }).subscribe(res => {
            this.object = res.data[0];
            if (this.object.favorite) {
              this.menuActions.favorite.iconClass = 'fa fa-star';
            } else {
              this.menuActions.favorite.iconClass = 'fa fa-star-o';
            }
          });
        },
        class: 'btn btn-default',
        liclass: '',
        tooltip: this.tooltip.addToFavorites,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-star'
      },
      editPhoto: {
        active: true,
        permission: mediaConstants.SHARING_PERMISSIONS.OWNER,
        inDropDown: false, // Outside dropdown list
        action: () => {
          this.hasEditPhoto = true;
        },
        class: 'btn btn-default',
        liclass: '',
        tooltip: this.tooltip.edit,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-edit'
      },
      delete: {
        active: true,
        permission: mediaConstants.SHARING_PERMISSIONS.OWNER,
        inDropDown: false, // Outside dropdown list
        action: () => {
          this.confirmService.confirm({
            header: 'Delete',
            acceptLabel: 'Delete',
            message: `Are you sure to delete this photo`,
            accept: () => {
              this.apiBaseService.post(`media/media/delete`, { objects: [this.object] }).subscribe(res => {
                this.back();
              });
            }
          });
        },
        class: 'btn btn-default',
        liclass: 'hidden-xs',
        tooltip: this.tooltip.delete,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-trash'
      },
      add: {
        active: true,
        permission: mediaConstants.SHARING_PERMISSIONS.OWNER,
        inDropDown: true, // Outside dropdown list
        action: () => {
          // this.showDetailsInfo = !this.showDetailsInfo;
          this.openModalAddToAlbum([this.object]);
        },
        class: '',
        liclass: '',
        title: 'Add To Album',
        tooltip: this.tooltip.info,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-plus-square'
      },
      info: {
        active: true,
        permission: mediaConstants.SHARING_PERMISSIONS.VIEW,
        inDropDown: true, // Outside dropdown list
        action: () => {
          this.showDetailsInfo = !this.showDetailsInfo;
        },
        class: '',
        liclass: '',
        title: 'View Information',
        tooltip: this.tooltip.info,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-info-circle'
      },
      download: {
        active: true,
        permission: mediaConstants.SHARING_PERMISSIONS.DOWNLOAD,
        inDropDown: true, // Inside dropdown list
        action: () => {
          this.downloadMedia([this.object]);
        },
        class: '',
        liclass: '',
        title: 'Download',
        tooltip: this.tooltip.info,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-download'
      },
      edit: {
        active: true,
        permission: mediaConstants.SHARING_PERMISSIONS.OWNER,
        inDropDown: true, // Outside dropdown list
        action: () => {
          this.openEditModal(this.object);
        },
        class: '',
        liclass: '',
        title: 'Edit Info',
        tooltip: this.tooltip.edit,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-edit'
      }
    }
  }

  onPrev() {
    this.listIds.prev();
    this.router.navigate([`/photos/${this.listIds.current.data}`], { queryParamsHandling: "merge" });
  };

  onNext() {
    this.listIds.next();
    this.router.navigate([`/photos/${this.listIds.current.data}`], { queryParamsHandling: "merge" });
  };

  back() {
    if(this.returnUrl) {
      this.router.navigate([this.returnUrl]);
    } else {
      this.location.back();
    }
  }
}
