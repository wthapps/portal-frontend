import { Component, OnDestroy, OnInit, ViewContainerRef, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { combineLatest } from 'rxjs/operators/combineLatest';

import {
  ApiBaseService, WthConfirmService,
} from '@wth/shared/services';
import { Constants } from '@shared/constant';
import { SharingModalMixin } from '@shared/shared/components/photo/modal/sharing/sharing-modal.mixin';
import { SharingModalResult } from '@shared/shared/components/photo/modal/sharing/sharing-modal';
import { ToastsService } from '@shared/shared/components/toast/toast-message.service';
import { SharingModalService } from '@shared/shared/components/photo/modal/sharing/sharing-modal.service';
import { Mixins  } from '@shared/design-patterns/decorator/mixin-decorator';
import { MediaAddModalService } from '@shared/shared/components/photo/modal/media/media-add-modal.service';
import { MediaCreateModalService } from '@shared/shared/components/photo/modal/media/media-create-modal.service';
import { mediaConstants } from '@media/shared/conig/constants';
import { DoublyLinkedLists } from '@shared/data-structures/link-list/doubly-linked-lists';
import { MediaDownloadMixin } from '@shared/mixin/media-download.mixin';
import { MediaModalMixin } from '@shared/mixin/media-modal.mixin';
import { PlaylistAddMixin } from '@shared/mixin/playlist/playlist-add.mixin';
import { MediaAdditionalListMixin } from '@shared/mixin/media-additional-list.mixin';
import { MediaPreviewMixin } from '@shared/mixin/media-preview.mixin';
import { MediaRenameModalComponent } from '@shared/shared/components/photo/modal/media/media-rename-modal.component';
import { PhotoEditModalComponent } from '@shared/shared/components/photo/modal/photo/photo-edit-modal.component';
import { AddToAlbumModalComponent } from '@shared/shared/components/photo/modal/photo/add-to-album-modal.component';


@Mixins([SharingModalMixin, MediaDownloadMixin, MediaModalMixin, PlaylistAddMixin, MediaAdditionalListMixin, MediaPreviewMixin])
@Component({
  selector: 'video-detail',
  templateUrl: './item-detail.component.html',
    styleUrls: ['video-detail.component.scss'],
    entryComponents: [
      // MediaRenameModalComponent,
      // PhotoEditModalComponent,
      // AddToAlbumModalComponent
    ]
})
export class ZVideoDetailComponent implements OnInit,
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
  showMenuAction: true;
  showDetailsInfo: any = false;
  modalIns: any;
  modalRef: any;
  subAddPlaylist: any;
  subOpenCreatePlaylist: any;
  subCreatePlaylist: any;
  returnUrl: any;
  sharings: any = [];
  listIds: DoublyLinkedLists;

  @ViewChild('modalContainer', { read: ViewContainerRef }) modalContainer: ViewContainerRef;

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
    public location: Location) {}
  ngOnInit() {
    this.menuActions = this.getMenuActions();
    this.route.data.subscribe(data => {
      this.showMenuAction = (data['show_menu_action'] !== undefined) ? data['show_menu_action'] : true;
    });

    this.route.params.pipe(
      combineLatest(this.route.queryParams)
    ).subscribe(([p, params]) => {
      this.apiBaseService.get(`media/media/${p.id}`, { model: 'Media::Video' }).toPromise()
      .then(res => {
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
            const query: any = { model: 'Media::Video' };
            if (params.parent_id) query.parent = params.parent_id;
            this.apiBaseService.get(`media/media/ids`, query).toPromise()
            .then(res2 => {
              if (res2.data) {
                this.listIds = new DoublyLinkedLists(res2.data.map(d => d.uuid));
                this.listIds.setCurrent(this.object.uuid);
              }
            });
          }
        }
        if (params.returnUrl) this.returnUrl = params.returnUrl;
      });
    });
  }


  openModalShareCustom() {
    this.openModalShare([this.object]);
  }
  onSaveShare(input: any) {
    const data: any = {
      objects: [this.object].map(s => ({ id: s.id, model: s.model } )),
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
        case 'editInfo' :
          this.apiBaseService.put(`media/videos/${this.object.id}`,
          { name: e.params.selectedObject.name,
             description: e.params.selectedObject.description, created_at: e.params.selectedObject.created_at})
          .subscribe(res => {
            this.object = res.data;
          });
      }
    });
  }

  infoAlbumClick(object) {
    if (object.object_type === 'Media::Playlist') {
      this.router.navigate([`/playlists/${object.uuid}`]);
    }
    if (object.object_type === 'sharing') {
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
              .map(v => ({ id: v.id, object_type: v.model } ))
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

  // onPrev: (term) => void;
  // onNext: (term) => void;
  onPrev() {
    this.listIds.prev();
    this.router.navigate([`/videos/${this.listIds.current.data}`], { queryParamsHandling: 'merge' });
  }

  onNext() {
    this.listIds.next();
    this.router.navigate([`/videos/${this.listIds.current.data}`], { queryParamsHandling: 'merge' });
  }

  back() {
    // this.location.back();
    if (this.returnUrl) {
      this.router.navigate([this.returnUrl]);
    } else {
      this.location.back();
    }
  }
}
