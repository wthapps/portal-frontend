import { Component, OnDestroy, OnInit, ViewContainerRef, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {
  ApiBaseService, WthConfirmService,
} from '@wth/shared/services';
import { Location } from '@angular/common';
import { Constants } from '@shared/constant';
import { MediaAdditionalListMixin } from '@media/shared/mixin/media-additional-list.mixin';
import { SharingModalMixin } from '@shared/shared/components/photo/modal/sharing/sharing-modal.mixin';
import { SharingModalResult } from '@shared/shared/components/photo/modal/sharing/sharing-modal';
import { ToastsService } from '@shared/shared/components/toast/toast-message.service';
import { SharingModalService } from '@shared/shared/components/photo/modal/sharing/sharing-modal.service';
import { Mixin } from '@shared/design-patterns/decorator/mixin-decorator';
import { MediaDownloadMixin } from '@media/shared/mixin/media-download.mixin';
import { MediaModalMixin } from '@media/shared/mixin/media-modal.mixin';
import { PlaylistAddMixin } from '@media/shared/mixin/playlist/playlist-add.mixin';
import { MediaAddModalService } from '@shared/shared/components/photo/modal/media/media-add-modal.service';
import { MediaCreateModalService } from '@shared/shared/components/photo/modal/media/media-create-modal.service';
import { mediaConstants } from '@media/shared/conig/constants';
import { CircularLinkedLists } from '@shared/data-structures/link-list/circular-linked-lists';
import { DoublyLinkedLists } from '@shared/data-structures/link-list/doubly-linked-lists';
import { MediaPreviewMixin } from '@media/shared/mixin/media-preview.mixin';

@Mixin([SharingModalMixin, MediaDownloadMixin, MediaModalMixin, PlaylistAddMixin, MediaAdditionalListMixin, MediaPreviewMixin])
@Component({
  selector: 'video-detail',
  templateUrl: '../shared/list/item-detail.component.html',
  styleUrls: ['video-detail.component.scss']
})
export class ZVideoDetailComponent implements OnInit,
  MediaAdditionalListMixin,
  SharingModalMixin,
  MediaDownloadMixin,
  MediaModalMixin,
  MediaPreviewMixin,
  PlaylistAddMixin {
  object: any;
  tooltip: any = Constants.tooltip;
  menuActions: any = {};
  subShareSave: any;
  selectedObjects: any;
  showDetailsInfo: any = false;
  modalIns: any;
  modalRef: any;
  subAddPlaylist: any;
  subOpenCreatePlaylist: any;
  subCreatePlaylist: any;
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
    public mediaAddModalService: MediaAddModalService,
    public mediaCreateModalService: MediaCreateModalService,
    public location: Location){}

  ngOnInit() {
    this.menuActions = this.getMenuActions();
    this.route.params.subscribe(p => {
      this.route.queryParams.subscribe(params => {
        this.apiBaseService.get(`media/media/${p.id}`, { model: 'Media::Video' }).subscribe(res => {
          this.object = res.data;
          if (this.object.favorite) {
            this.menuActions.favorite.iconClass = 'fa fa-star';
          } else {
            this.menuActions.favorite.iconClass = 'fa fa-star-o';
          }
          // reload video
          if ($('#video')[0]) $('#video')[0].load();
          this.validateActions(this.menuActions, this.object.permission.role_id);
          if (!this.listIds && params.preview) {
            if (params.ids) {
              this.listIds = new DoublyLinkedLists(params.ids.split(','));
              this.listIds.setCurrent(this.object.id);
            } else {
              let query: any = { model: 'Media::Video' }
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
        });
      });
    })
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
        case 'editInfo' :
          this.apiBaseService.put(`media/videos/${this.object.id}`, { name: e.params.selectedObject.name, description: e.params.selectedObject.description, created_at: e.params.selectedObject.created_at}).subscribe(res => {
            this.object = res.data
          });
        default:
          break;
      }
    })
  }

  openModalAddToPlaylist:(selectedObjects: any) => void;
  onAddToPlaylist:(e: any) => void;
  onAddedToPlaylist: (data: any) => void;
  openCreatePlaylistModal:(selectedObjects: any) => void;
  onDonePlaylist:(e: any) => void;

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
    }
  }

  // onPrev: (term) => void;
  // onNext: (term) => void;
  onPrev() {
    this.listIds.prev();
    this.router.navigate([`/videos/${this.listIds.current.data}`], { queryParamsHandling: "merge" });
  };

  onNext() {
    this.listIds.next();
    this.router.navigate([`/videos/${this.listIds.current.data}`], { queryParamsHandling: "merge" });
  };

  back() {
    // this.location.back();
    if (this.returnUrl) {
      this.router.navigate([this.returnUrl]);
    } else {
      this.location.back();
    }
  }
}
