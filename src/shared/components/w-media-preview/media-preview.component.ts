import { Component, OnDestroy, OnInit, ViewContainerRef, ViewChild,
   ComponentFactoryResolver, ContentChild, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { combineLatest } from 'rxjs/operators/combineLatest';
import { Subject } from 'rxjs';
import * as Cropper from 'cropperjs';

import {
  ApiBaseService, WthConfirmService,
} from '@wth/shared/services';
import { Constants } from '@shared/constant';
import { SharingModalMixin } from '@shared/shared/components/photo/modal/sharing/sharing-modal.mixin';
import { SharingModalResult } from '@shared/shared/components/photo/modal/sharing/sharing-modal';
import { ToastsService } from '@shared/shared/components/toast/toast-message.service';
import { SharingModalService } from '@shared/shared/components/photo/modal/sharing/sharing-modal.service';
import { MediaAddModalService } from '@shared/shared/components/photo/modal/media/media-add-modal.service';
import { MediaCreateModalService } from '@shared/shared/components/photo/modal/media/media-create-modal.service';
import { mediaConstants } from '@media/shared/config/constants';
import { MediaDownloadMixin } from '@shared/mixin/media-download.mixin';
import { MediaModalMixin } from '@shared/mixin/media-modal.mixin';
import { PlaylistAddMixin } from '@shared/mixin/playlist/playlist-add.mixin';
import { MediaAdditionalListMixin } from '@shared/mixin/media-additional-list.mixin';
import { MediaPreviewMixin } from '@shared/mixin/media-preview.mixin';
import { DoublyLinkedListsV2 } from '@shared/data-structures/link-list/doubly-linked-lists-v2';
import { Mixins } from '@shared/design-patterns/decorator/mixin-decorator';


const MODEL_MAP = {
  'photo': '::Media::Photo',
  'video': '::Media::Video',
  'post': '::SocialNetwork::Post',
  'comment': '::SocialNetwork::Comment',
  'conversation': '::Chat::Group',
};

@Mixins([SharingModalMixin, MediaDownloadMixin, MediaModalMixin, PlaylistAddMixin, MediaAdditionalListMixin, MediaPreviewMixin])
@Component({
  selector: 'media-preview',
  templateUrl: './item-detail.component.html',
  styleUrls: ['media-preview.component.scss']
})
export class ZMediaPreviewComponent implements OnInit, OnDestroy,
  MediaAdditionalListMixin,
  SharingModalMixin,
  MediaDownloadMixin,
  MediaModalMixin,
  MediaPreviewMixin,
  PlaylistAddMixin {
  object: any;
  readonly tooltip: any = Constants.tooltip;
  menuActions: any = {};
  selectedObjects: any;
  showDetailsInfo: any = false;
  modalIns: any;
  modalRef: any;
  subAddPlaylist: any;
  subOpenCreatePlaylist: any;
  subCreatePlaylist: any;
  returnUrl: any;
  sharings: any = [];
  listIds: DoublyLinkedListsV2;

  // Photos
  loading: any;
  image: any;
  cropper: any;
  loadingImg: any;
  hasEditPhoto: any;
  subAddAlbum: any;
  subOpenCreateAlbum: any;
  subCreateAlbum: any;
  destroy$ = new Subject();

  @ViewChild('modalContainer', { read: ViewContainerRef }) modalContainer: ViewContainerRef;
  @ContentChild('menuAction') menuAction;
  @Output() parentLoad: EventEmitter<any> = new EventEmitter();

  validateActions: (menuActions: any, role_id: number) => any;
  openModalShare: (input: any) => void;
  onEditShare: (e: SharingModalResult, sharing: any) => void;

  downloadMedia: (media: any) => void;
  loadModalComponent: (component: any) => void;

  openEditModal: (object: any) => void;
  openModalAddToPlaylist: (selectedObjects: any) => void;
  onAddToPlaylist: (e: any) => void;
  onAddedToPlaylist: (data: any) => void;
  openCreatePlaylistModal: (selectedObjects: any) => void;
  onDonePlaylist: (e: any) => void;

  constructor(public apiBaseService: ApiBaseService,
    public route: ActivatedRoute,
    public router: Router,
    public resolver: ComponentFactoryResolver,
    public sharingModalService: SharingModalService,
    public toastsService: ToastsService,
    public confirmService: WthConfirmService,
    public mediaAddModalService: MediaAddModalService,
    public mediaCreateModalService: MediaCreateModalService,
    public location: Location) { }

  ngOnInit() {
    this.menuActions = this.getMenuActions();

    this.route.paramMap.pipe(
      combineLatest(this.route.queryParams)
    ).subscribe(([p, _]) => {
      const parent_object = p.get('object');
      const options = { model: MODEL_MAP[parent_object] };

      // uuid will be required for parent object type 'post' or 'conversation'
      if (p.get('parent_uuid')) {
        Object.assign(options, { uuid: p.get('parent_uuid') });
      }
      this.apiBaseService.get(`media/media/${p.get('id')}`, options).toPromise()
        .then(res => {
          this.object = res.data;
          this.menuActions.favorite.iconClass = this.object.favorite ? 'fa fa-star' : 'fa fa-star-o';

          // reload video
          if ($('#video')[0]) { $('#video')[0].load(); }
          this.validateActions(this.menuActions, this.object.permission.role_id);
        })
        .then(() => {
          if (!this.listIds) {
            const query: any = { model: MODEL_MAP[this.route.snapshot.paramMap.get('object')] };
            if (p.get('parent_uuid')) { query.parent_uuid = p.get('parent_uuid'); }
            this.apiBaseService.get(`media/media/relating_objects`, query).toPromise()
              .then(res2 => {
                if (res2.data) {
                  if (res2.data.length === 0) {
                  return;
                  }
                  this.listIds = new DoublyLinkedListsV2(res2.data.map(d => ({uuid: d.uuid, model: d.model, parent: d.parent})));
                  const {uuid, model} = this.object;
                  this.listIds.setCurrent({uuid, model});
                  this.parentLoad.emit(this.listIds.current.data.parent);
                }
              });
          } else {
            this.parentLoad.emit(this.listIds.current.data.parent);
          }
          this.returnUrl = p.get('returnUrl') || this.returnUrl;
        });
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

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
          if (this.route.snapshot.queryParamMap.get('object') !== 'video') {
          return;
          }
          this.apiBaseService.put(`media/videos/${this.object.id}`,
            {
              name: e.params.selectedObject.name,
              description: e.params.selectedObject.description, created_at: e.params.selectedObject.created_at
            })
            .subscribe(res => {
              this.object = res.data;
            });
      }
    });
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

  infoAlbumClick(object) {
    if (object.model === 'Media::Playlist') {
      this.router.navigate([`/playlists/${object.uuid}`]);
    }
    if (object.model === 'Common::Sharing') {
      this.router.navigate([`/shared/${object.uuid}`]);
    }
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
      add: {
        active: true,
        permission: mediaConstants.SHARING_PERMISSIONS.OWNER,
        inDropDown: true, // Outside dropdown list
        action: () => {
          this.openModalAddToPlaylist([this.object]);
        },
        class: '',
        liclass: '',
        title: 'Add To Playlist',
        tooltip: this.tooltip.info,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-plus-square'
      },
      delete: {
        active: true,
        permission: mediaConstants.SHARING_PERMISSIONS.OWNER,
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
        permission: mediaConstants.SHARING_PERMISSIONS.VIEW,
        inDropDown: true, // Outside dropdown list
        action: () => {
          this.showDetailsInfo = !this.showDetailsInfo;
          this.apiBaseService.get(`media/object/${this.object.id}/sharings`, { model: 'Media::Video' }).subscribe(res => {
            this.sharings = res.data;
          });
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

  download() {
    this.downloadMedia([this.object]);
  }

  // onPrev: (term) => void;
  // onNext: (term) => void;
  onPrev() {
    this.listIds.prev();
    const { id, ...restParams } = this.route.snapshot.params;
    this.router.navigate(['../', this.listIds.current.data.uuid, restParams], { relativeTo: this.route, queryParamsHandling: 'merge' });
  }

  onNext() {
    this.listIds.next();
    // const params = { ...this.route.snapshot.params, id: this.listIds.current.data.uuid };
    const {id, ...restParams} = this.route.snapshot.params;
    this.router.navigate(['../', this.listIds.current.data.uuid, restParams], { relativeTo: this.route, queryParamsHandling: 'merge' });
  }

  back() {
    // this.location.back();
    if (this.returnUrl) {
      this.router.navigate([this.returnUrl]);
    } else {
      const outlet = this.route.snapshot.outlet;
      if (outlet !== 'primary') {
        this.router.navigate([{ outlets: { [outlet]: null}}]);
      } else {
        this.location.back();
      }
    }
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
}
