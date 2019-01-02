import { Component, OnDestroy, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { combineLatest } from 'rxjs/operators/combineLatest';
import * as Cropper from 'cropperjs';

import {
  ApiBaseService,
  PhotoService,
  UrlService
} from '@wth/shared/services';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';
import { Constants } from '@shared/constant';
import { Mixins  } from '@shared/design-patterns/decorator/mixin-decorator';
import { SharingModalService } from '@shared/shared/components/photo/modal/sharing/sharing-modal.service';
import { ToastsService } from '@shared/shared/components/toast/toast-message.service';
import { SharingModalResult } from '@shared/shared/components/photo/modal/sharing/sharing-modal';
import { SharingModalMixin } from '@shared/shared/components/photo/modal/sharing/sharing-modal.mixin';
import { MediaAddModalService } from '@shared/shared/components/photo/modal/media/media-add-modal.service';
import { MediaCreateModalService } from '@shared/shared/components/photo/modal/media/media-create-modal.service';
import { mediaConstants } from '@media/shared/config/constants';
import { DoublyLinkedLists } from '@shared/data-structures/link-list/doubly-linked-lists';
import { MediaAdditionalListMixin } from '@shared/mixin/media-additional-list.mixin';
import { MediaDownloadMixin } from '@shared/mixin/media-download.mixin';
import { MediaModalMixin } from '@shared/mixin/media-modal.mixin';
import { AlbumAddMixin } from '@shared/mixin/album/album-add.mixin';
import { MediaPreviewMixin } from '@shared/mixin/media-preview.mixin';
import { MediaRenameModalComponent } from '@shared/shared/components/photo/modal/media/media-rename-modal.component';
import { PhotoEditModalComponent } from '@shared/shared/components/photo/modal/photo/photo-edit-modal.component';
import { AddToAlbumModalComponent } from '@shared/shared/components/photo/modal/photo/add-to-album-modal.component';
import { MediaListDetailMixin } from '@shared/mixin/media-list-detail.mixin';
import { Subject } from 'rxjs';

@Mixins([MediaAdditionalListMixin, SharingModalMixin, MediaDownloadMixin, MediaModalMixin, AlbumAddMixin, MediaPreviewMixin,
   MediaListDetailMixin])
@Component({
  selector: 'photo-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['photo-detail.component.scss']
})
export class PhotoDetailComponent implements OnInit, OnDestroy,
  MediaAdditionalListMixin,
  SharingModalMixin,
  MediaDownloadMixin,
  MediaPreviewMixin,
  MediaModalMixin,
  MediaListDetailMixin,
  AlbumAddMixin {
  object: any;
  readonly tooltip: any = Constants.tooltip;
  menuActions: any = {};
  selectedObjects: any;
  showMenuAction: true;
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
  returnUrls: any;
  model: any;
  sharings: any = [];
  listIds: DoublyLinkedLists;
  destroy$ = new Subject();

  @ViewChild('modalContainer', { read: ViewContainerRef }) modalContainer: ViewContainerRef;

  validateActions: (menuActions: any, role_id: number) => any;
  openModalShare: (input: any) => void;
  onEditShare: (e: SharingModalResult, sharing: any) => void;

  downloadMedia: (media: any) => void;
  loadModalComponent: (component: any) => void;

  openEditModal: (object: any) => void;
  openModalAddToAlbum: (selectedObjects: any) => void;
  onAddToAlbum: (e: any) => void;
  openCreateAlbumModal: (selectedObjects: any) => void;
  onDoneAlbum: (e: any) => void;
  onAddedToAlbum(data: any) {
    this.apiBaseService.get(`media/media/${this.object.uuid}`, { model: 'Media::Photo' }).toPromise()
      .then(res => {
        this.object = res.data;
      });
  }


  constructor(public apiBaseService: ApiBaseService,
    public route: ActivatedRoute,
    public router: Router,
    public resolver: ComponentFactoryResolver,
    public sharingModalService: SharingModalService,
    public toastsService: ToastsService,
    public confirmService: WthConfirmService,
    public photoService: PhotoService,
    public urlSerive: UrlService,
    public mediaAddModalService: MediaAddModalService,
    public mediaCreateModalService: MediaCreateModalService,
    public location: Location) {
    this.showMenuAction = true;
  }

  ngOnInit() {
    this.menuActions = this.getMenuActions();
    this.returnUrls = this.route.snapshot.queryParams.returnUrls;
    this.route.params.pipe(
      combineLatest(this.route.queryParams)
      ).subscribe(([p, params]) => {
      this.model = this.route.snapshot.queryParams.model || 'Media::Photo';
      this.apiBaseService.get(`media/media/${p.id}`, { model: this.model }).toPromise()
        .then(res => {
          this.object = res.data;
          if (this.object.favorite) {
            this.menuActions.favorite.iconClass = 'fa fa-star';
          } else {
            this.menuActions.favorite.iconClass = 'fa fa-star-o';
          }
          // reload video
          if (this.model === 'Media::Video' && $('#video')[0]) { $('#video')[0].load(); }
          this.validateActions(this.menuActions, this.object.permission.role_id);
          if (!this.listIds && params.preview) {
            if (params.objects) {
              // this.listIds = new DoublyLinkedLists(params.ids.split(','));
              // this.listIds.setCurrent(this.object.id);
              const objects = params.objects.map(ob => {
                const tmp = ob.split(',');
                return {
                  id: tmp[0],
                  model: tmp[1]
                };
              });
              this.listIds = new DoublyLinkedLists(objects);
              this.listIds.setCurrent(this.object.uuid);
            } else {
              const query: any = {};
              if (params.parent_id) { query.parent = params.parent_id; }
              this.apiBaseService.get(`media/media/ids_combine`, query).toPromise()
                .then(res2 => {
                  if (res2.data) {
                    this.listIds = new DoublyLinkedLists(res2.data.map(d => ({id: d.uuid, model: d.model})));
                    this.listIds.setCurrent(this.object.uuid);
                  }
                });
            }
          }
        });
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadObject: (input?: any) => void;

  toggleInfo: () => void;

  openModalShareCustom() {
    this.openModalShare([this.object]);
  }
  onSaveShare(input: any) {
    const data: any = {
      objects: [this.object].map(s => ({ id: s.id, model: s.model })),
      recipients: input.users,
      role_id: input.role.id
    };

    this.apiBaseService.post('media/sharings', data).subscribe(res => {
      this.sharingModalService.update.next(res.data);
    });
  }
  onAfterEditModal() {
    this.modalIns.event.subscribe(e => {
      switch (e.action) {
        case 'editInfo':
          this.apiBaseService.put(`media/photos/${this.object.id}`, e.params.selectedObject).subscribe(res => {
            const parents = this.object.parents;
            this.object = res.data;
            this.object.parents = parents;
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

  infoAlbumClick(object) {
    if (object.object_type === 'album') {
      this.router.navigate([`/albums/${object.uuid}`]);
    }
    if (object.object_type === 'sharing') {
      this.router.navigate([`/shared/${object.uuid}`]);
    }
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
              .map(v => ({ id: v.id, object_type: v.model }))
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
        inDropDown: false, // Outside dropdown list
        action: () => {
          this.showDetailsInfo = !this.showDetailsInfo;
          this.apiBaseService.get(`media/object/${this.object.id}/sharings`, { model: 'Media::Photo' }).subscribe(res => {
            this.sharings = res.data;
          });
        },
        class: 'btn btn-default',
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
    };
  }

  onPrev() {
    this.listIds.prev();
    const url = '/photos/';
    this.router.navigate([`${url + this.listIds.current.data.id}`], { queryParams: { model: this.listIds.current.data.model },
     queryParamsHandling: 'merge' });
  }

  onNext() {
    this.listIds.next();
    const url = '/photos/';
    this.router.navigate([`${url + this.listIds.current.data.id}`], { queryParams: { model: this.listIds.current.data.model},
     queryParamsHandling: 'merge' });
  }

  back: () => void;
}
