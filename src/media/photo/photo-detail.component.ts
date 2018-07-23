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
import { SharingService } from '@wth/shared/shared/components/photo/modal/sharing/sharing.service';
import { Location } from '@angular/common';
import { MediaBasicListMixin } from '@media/shared/mixin/media-basic-list.mixin';
import { Constants } from '@shared/constant';
import { MediaDetailMixin } from '@media/shared/mixin/media-detail.mixin';
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
@Mixin([MediaAdditionalListMixin, SharingModalMixin, MediaDownloadMixin, MediaModalMixin])
@Component({
  selector: 'photo-detail',
  templateUrl: '../shared/list/item-detail.component.html',
  styleUrls: ['photo-detail.component.scss'],
})
export class PhotoDetailComponent implements OnInit, MediaAdditionalListMixin, SharingModalMixin, MediaDownloadMixin, MediaModalMixin {

  // object: any;
  // loading: any;
  // ids: any;
  // mode: any;
  // showDetail: any;
  // isOwner: any;
  // recipients: any;

  // constructor(public apiBaseService: ApiBaseService,
  //   public confirmService: WthConfirmService,
  //   public route: ActivatedRoute,
  //   public photoService: PhotoService,
  //   public location: Location) { }

  // ngOnInit() {
  //   this.route.params.subscribe(p => {
  //     this.photoService.getPhoto(p.id).subscribe(res => {
  //       this.object = res.data;
  //     });
  //   })
  // }
  // doEvent(e: any) {
  //   switch (e.action) {
  //     case 'goBack' :
  //       this.back();
  //     default:
  //       break;
  //   }
  // }

  // loadObject(input?: any) {
  //   throw new Error('should overwrite this method');
  // }

  // toggleFavorite(item?: any) {
  //   let data = this.object;
  //   if (item) data = item;

  //   this.apiBaseService
  //     .post(`media/favorites/toggle`, {
  //       objects: data.map(v => {
  //         return { id: v.id, object_type: v.model };
  //       })
  //     })
  //     .subscribe(res => {
  //       this.onToggleFavorite(res.data);
  //     });
  // }

  // onToggleFavorite(input: any) {
  //   throw new Error('should overwrite this method');
  // }

  // deleteObject(term: any = 'photo') {
  //   this.confirmService.confirm({
  //     header: 'Delete',
  //     acceptLabel: 'Delete',
  //     message: `Are you sure to delete this ${term}`,
  //     accept: () => {
  //       this.loading = true;
  //       this.apiBaseService.post(`media/media/delete`, { objects: [this.object] }).subscribe(res => {
  //         this.back();
  //         this.loading = false;
  //       })
  //     }
  //   })
  // }
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
  @ViewChild('modalContainer', { read: ViewContainerRef }) modalContainer: ViewContainerRef;

  constructor(public apiBaseService: ApiBaseService,
    public route: ActivatedRoute,
    public resolver: ComponentFactoryResolver,
    public sharingModalService: SharingModalService,
    public toastsService: ToastsService,
    public confirmService: WthConfirmService,
    public location: Location) { }

  ngOnInit() {
    this.menuActions = this.getMenuActions();
    this.route.params.subscribe(params => {
      this.apiBaseService.get(`media/photos/${params.id}`).subscribe(res => {
        this.object = res.data;
        if (this.object.favorite) {
          this.menuActions.favorite.iconClass = 'fa fa-star';
        } else {
          this.menuActions.favorite.iconClass = 'fa fa-star-o';
        }
      })
    })
  }

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
          this.apiBaseService.put(`media/videos/${this.object.id}`, { name: e.params.selectedObject.name }).subscribe(res => {
            this.object = res.data
          })
        default:
          break;
      }
    })
  }

  onStart(event?: any) {
    this.image =
      event && event.path
        ? event.path[0]
        : document.getElementById('image-viewer');
    this.cropper = new Cropper(this.image, {
      autoCrop: false,
      // dragMode: 'move',
      dragMode: 'none',
      background: false,
      viewMode: 1, // restrict the crop box to not exceed the size of the canvas.
      // viewMode: 2, // restrict the minimum canvas size to fit within the container.
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

  getMenuActions() {
    return {
      active_drop: true,
      share: {
        active: true,
        // needPermission: 'view',
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
        // needPermission: 'view',
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
      delete: {
        active: true,
        // needPermission: 'view',
        inDropDown: false, // Outside dropdown list
        action: () => {
          this.confirmService.confirm({
            header: 'Delete',
            acceptLabel: 'Delete',
            message: `Are you sure to delete this video`,
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
      info: {
        active: true,
        // needPermission: 'view',
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
        // needPermission: 'view',
        inDropDown: true, // Outside dropdown list
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
        // needPermission: 'view',
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

  back() {
    this.location.back();
  }
}
