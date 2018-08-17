import {
  Component,
  OnInit,
  OnDestroy,
  ComponentFactoryResolver,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import {
  ApiBaseService,
  CommonEventService
} from '@shared/services';
import {
  GetAll,
  GetMore,
  Favorite,
  AddSuccess,
  AddToDetailObjects,
  RemoveFromDetailObjects,
  Download,
  DeleteMany
} from '../shared/store/media/media.actions';
import { Constants } from '@wth/shared/constant';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';
import { ToastsService } from '@shared/shared/components/toast/toast-message.service';
import { MediaListDetailMixin } from '@media/shared/mixin/media-list-detail.mixin';
import { MediaBasicListMixin } from '@media/shared/mixin/media-basic-list.mixin';
import { MediaAdditionalListMixin } from '@media/shared/mixin/media-additional-list.mixin';
import { LoadModalAble } from '@shared/shared/mixins/modal/load-modal-able.mixin';
import { SharingModalMixin } from '@shared/shared/components/photo/modal/sharing/sharing-modal.mixin';
import { PlaylistAddMixin } from '@media/shared/mixin/playlist/playlist-add.mixin';
import { MediaDownloadMixin } from '@media/shared/mixin/media-download.mixin';
import { Mixin } from '@shared/design-patterns/decorator/mixin-decorator';
import { SharingCreateParams, SharingModalResult } from '@shared/shared/components/photo/modal/sharing/sharing-modal';
import { MediaRenameModalComponent } from '@shared/shared/components/photo/modal/media/media-rename-modal.component';
import { MediaAddModalService } from '@shared/shared/components/photo/modal/media/media-add-modal.service';
import { MediaCreateModalService } from '@shared/shared/components/photo/modal/media/media-create-modal.service';
import { SharingModalService } from '@shared/shared/components/photo/modal/sharing/sharing-modal.service';
import { Location } from '@angular/common';
import { MediaDetailInfoComponent } from '@media/shared/media/media-detail-info.component';
import { mediaConstants } from '@media/shared/conig/constants';
import { WMediaSelectionService } from '@shared/components/w-media-selection/w-media-selection.service';
import { AlbumAddMixin } from '@media/shared/mixin/album/album-add.mixin';
import { MediaModalMixin } from '@media/shared/mixin/media-modal.mixin';
import { WUploader } from '@shared/services/w-uploader';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

@Mixin([
  MediaBasicListMixin,
  MediaAdditionalListMixin,
  MediaListDetailMixin,
  LoadModalAble,
  SharingModalMixin,
  AlbumAddMixin,
  MediaModalMixin,
  MediaDownloadMixin
])
@Component({
  moduleId: module.id,
  selector: 'me-sharing-detail',
  templateUrl: 'album-detail.component.html'
})
export class ZMediaAlbumDetailComponent
  implements
  OnInit, OnDestroy,
  MediaListDetailMixin,
  MediaBasicListMixin,
  MediaAdditionalListMixin,
  MediaModalMixin,
  LoadModalAble,
  SharingModalMixin,
  AlbumAddMixin,
  MediaDownloadMixin {
  objects: any;
  object: any;
  recipients: any;
  hasSelectedObjects: boolean;
  selectedObjects: any = [];
  favoriteAll: any;
  loading: boolean;
  tooltip: any = Constants.tooltip;
  viewModes: any = { grid: 'grid', list: 'list', timeline: 'timeline' };
  viewMode: any = this.viewModes.grid;
  links: any;
  showDetailsInfo: any;
  // ============
  titleNoData: any = 'There is no photo!';
  subTitleNoData: any = 'Try to add a photo';
  iconNoData: any = 'fa fa-file-image-o';
  // ===========
  menuActions: any = {};
  parentMenuActions: any = {};
  subMenuActions: any = {};
  modalIns: any;
  modalRef: any;
  subShareSave: any;
  // ============
  subSelect: any;
  subAddAlbum: any;
  subOpenCreateAlbum: any;
  subCreateAlbum: any;
  // ============

  @ViewChild('modalContainer', { read: ViewContainerRef }) modalContainer: ViewContainerRef;
  @ViewChild('mediaInfo') mediaInfo: MediaDetailInfoComponent;

  private uploadingFiles: Array<any> = [];
  private objectType = 'Media::Photo';
  private destroy$ = new Subject();

  constructor(public mediaAddModalService: MediaAddModalService,
    public mediaCreateModalService: MediaCreateModalService,
    public sharingModalService: SharingModalService,
    public toastsService: ToastsService,
    public apiBaseService: ApiBaseService,
    public resolver: ComponentFactoryResolver,
    public confirmService: WthConfirmService,
    public mediaSelectionService: WMediaSelectionService,
    public router: Router,
    public route: ActivatedRoute,
    public location: Location,
    private uploader: WUploader) { }

  ngOnInit() {
    this.route.params.subscribe(p => {
      this.parentMenuActions = this.getMenuActions();
      this.subMenuActions = this.getSubMenuActions();
      this.menuActions = this.parentMenuActions;
      this.loadObjects(p.uuid);
      this.loadObject(p.uuid);
    });
  }

  doListEvent(e: any) {
    switch (e.action) {
      case 'viewDetails':
        this.viewDetail();
        break;
      case 'favorite':
        this.toggleFavorite(e.payload);
        break;
    }
  }

  openSelectedModal() {
    this.mediaSelectionService.open({
      hiddenTabs: ['videos', 'playlists'],
      allowCancelUpload: true,
      allowedFileTypes: ['image/*']
    });
    if (this.subSelect) this.subSelect.unsubscribe();
    this.subSelect = this.mediaSelectionService.selectedMedias$.filter((items: any[]) => items.length > 0)
      .subscribe(photos => {
        this.onAddToAlbum({parents: [this.object], children: photos});
        this.objects = [...photos.filter(p => p.model === this.objectType), ...this.objects];
      });

    this.uploader.event$.pipe(takeUntil(this.destroy$)).subscribe(event => {
      this.handleUploadFiles(event);
    });
  }

  handleUploadFiles(event: any) {
    switch (event.action) {
      case 'start':
        this.uploadingFiles = [];
        break;
      case 'success':
        const file = event.payload.resp;
        // just add to playlist all files are videos
        if (file.content_type.startsWith('image')) {
          this.uploadingFiles.push({...file, model: this.objectType});
        }
        break;
      case 'complete':
        if (this.uploadingFiles.length > 0) {
          this.onAddToAlbum({ parents: [this.object], children: this.uploadingFiles });
          this.objects = this.uploadingFiles;
        }
        break;
    }
  }

  doToolbarEvent(e: any) {
    switch (e.action) {
      case 'uploaded':
        this.apiBaseService.post(`media/playlists/add_to_playlist`, { playlist: { id: this.object.id }, videos: [e.payload] }).subscribe(res => {
          this.loadObjects(this.object.uuid);
        });
        break;
      case 'changeView':
        this.changeViewMode(e.payload);
        break;
      case 'toggleInfo':
        this.toggleInfo();
        break;
    }
  }

  onListChanges(e: any) {
    switch (e.action) {
      case 'favorite':
        // this.menuActions.favorite.iconClass = this.favoriteAll ? 'fa fa-star' : 'fa fa-star-o';
        break;
      case 'selectedObjectsChanged':
        if (this.object.sharing_type === 'Media::Playlist' || this.object.sharing_type === 'Media::Video') {
          this.subMenuActions.edit.title = 'Add to Playlist';
          this.subMenuActions.remove.title = 'Remove from Playlist';
        } else {
          this.subMenuActions.edit.title = 'Add to Album';
          this.subMenuActions.remove.title = 'Remove from Album';
        }
        break;
      default:
        break;
    }
  }

  loadObjects(input: any) {
    this.loading = true;
    this.apiBaseService.get(`media/media/${input}/objects`, {model: 'Media::Album'}).subscribe(res => {
      this.objects = res.data;
      this.links = res.meta.links;
      this.loading = false;
    });
  }

  openModalAddToAlbum:(selectedObjects: any) => void;
  onAddToAlbum:(e: any) => void;
  openCreateAlbumModal:(selectedObjects: any) => void;
  onDoneAlbum:(e: any) => void;

  loadObject(input: any) {
    this.apiBaseService.get(`media/albums/${input}`).subscribe(res => {
      this.object = res.data;
      if (this.object.favorite) {
        this.menuActions.favorite.iconClass = 'fa fa-star';
      } else {
        this.menuActions.favorite.iconClass = 'fa fa-star-o';
      }
      this.validateActions(this.subMenuActions, this.object.recipient ? this.object.recipient.role_id : mediaConstants.SHARING_PERMISSIONS.OWNER)
      this.validateActions(this.parentMenuActions, this.object.recipient ? this.object.recipient.role_id : mediaConstants.SHARING_PERMISSIONS.OWNER)
    });
  }
  validateActions: (menuActions: any, role_id: number) => any;

  loadMoreObjects(input?: any) {
    /* this method is load objects to display on init */
    throw new Error('should overwrite this method');
  }

  viewDetail(input?: any) {
    this.router.navigate([`photos/${this.selectedObjects[0].uuid}`], { queryParams: { parent_id: this.object.id, preview: true } });
  }

  doNoData() {
    throw new Error('should overwrite this method');
  }

  back() {
    this.location.back();
  }

  editName(object: any) {
    this.loadModalComponent(MediaRenameModalComponent);
    this.modalIns.open({ selectedObject: this.object });
    this.modalIns.event.subscribe(e => {
      this.apiBaseService.put(`media/albums/${this.object.id}`, this.object).subscribe(res => {
      });
    })
  }

  selectedObjectsChanged(objectsChanged: any) {
    if (this.objects) {
      this.objects.forEach(ob => {
        if (objectsChanged.some(el => el.id == ob.id && (el.object_type == ob.object_type || el.model == ob.model))) {
          ob.selected = true;
        } else {
          ob.selected = false;
        }
      });
      this.selectedObjects = this.objects.filter(v => v.selected == true);
      this.hasSelectedObjects = (this.selectedObjects && this.selectedObjects.length > 0) ? true : false;
      this.menuActions = this.hasSelectedObjects ? this.subMenuActions : this.parentMenuActions;
      this.subMenuActions.favorite.iconClass = this.selectedObjects.every(s => s.favorite) ? 'fa fa-star' : 'fa fa-star-o';
      this.onListChanges({ action: 'selectedObjectsChanged' });
    }
  }

  loadModalComponent: (component: any) => void;
  toggleInfo: () => void;
  toggleInfoCustom() {
    this.mediaInfo.object = {...this.object};
    this.toggleInfo();
  };

  toggleFavorite(items?: any) {
    let data = this.selectedObjects;
    if (items) data = items;
    this.apiBaseService.post(`media/favorites/toggle`, {
      objects: data
        .map(v => { return { id: v.id, object_type: v.model } })
    }).subscribe(res => {
      this.objects = this.objects.map(v => {
        let tmp = res.data.filter(d => d.id == v.id);
        if (tmp && tmp.length > 0) {
          v.favorite = tmp[0].favorite;
        }
        return v;
      })
      this.subMenuActions.favorite.iconClass = this.selectedObjects.every(s => s.favorite) ? 'fa fa-star' : 'fa fa-star-o';
    });
  }

  deSelect() {
    this.objects.forEach(ob => {
      ob.selected = false;
    });
    this.selectedObjects = [];
    this.hasSelectedObjects = false;
  }

  deleteObjects(term: any = 'items') {
    this.confirmService.confirm({
      header: 'Delete',
      acceptLabel: 'Delete',
      message: `Are you sure to delete ${this.selectedObjects.length} ${term}`,
      accept: () => {
        this.loading = true;
        this.apiBaseService.post(`media/media/delete`, { objects: this.selectedObjects }).subscribe(res => {
          this.loadObjects(this.object.uuid);
          this.loading = false;
        })
      }
    })
  }

  deleteParent() {
    // share with me
    if (this.object.recipient) {
      this.confirmService.confirm({
        header: 'Delete',
        acceptLabel: 'Delete',
        message: `Are you sure to delete this sharing`,
        accept: () => {
          this.loading = true;
          this.apiBaseService.post(`media/sharings/delete_sharings_with_me`, { sharings: [this.object] }).subscribe(res => {
            this.back();
          })
        }
      })
    } else {
      this.confirmService.confirm({
        header: 'Delete',
        acceptLabel: 'Delete',
        message: `Are you sure to delete this album`,
        accept: () => {
          this.loading = true;
          this.apiBaseService.post(`media/media/delete`, { objects: [this.object] }).subscribe(res => {
            this.back();
          })
        }
      });
    }
  }

  changeViewMode(mode: any) {
    this.viewMode = mode;
  }

  toggleFavoriteParent() {
    this.toggleFavorite([this.object]);
    this.object.favorite = !this.object.favorite;
    this.menuActions.favorite.iconClass = this.object.favorite ? 'fa fa-star' : 'fa fa-star-o';
  }

  removeFromParent() {
    this.apiBaseService.post(`media/playlists/remove_from_playlist`, { playlist: { id: this.object.id }, videos: this.selectedObjects.map(ob => { return { id: ob.id, model: ob.model } }) }).subscribe(res => {
      this.toastsService.success('You removed videos successfully!');
      this.loadObjects(this.object.uuid);
      this.selectedObjects = [];
      this.hasSelectedObjects = false;
    });
  }

  openModalShareParent() {
    this.openModalShare([this.object.sharing_object]);
  }

  openModalShare: (input: any) => void;

  onSaveShare(e: SharingModalResult) {
    const objects = this.hasSelectedObjects ? this.selectedObjects : [this.object];
    const data: SharingCreateParams = {
      objects: objects.map(s => { return { id: s.id, model: s.model } }),
      recipients: e.recipients.map(s => { return { role_id: s.role_id, recipient_id: s.user.id } }),
      role_id: e.role.id
    };
    this.apiBaseService.post('media/sharings', data).subscribe(res => {
      // this.toastsService.success('You have just create sharing successful');
      this.sharingModalService.update.next(res.data);
    });
  }
  onEditShare: (e: SharingModalResult, sharing: any) => void;

  downloadMediaCustom() {
    if (this.selectedObjects && this.selectedObjects.length > 0) {
      this.downloadMedia(this.selectedObjects);
    } else {
      this.downloadMedia(this.objects);
    }
  }

  downloadMedia: (media: any) => void;

  openEditModal:(object: any) => void;
  onAfterEditModal() {
    this.modalIns.event.subscribe(e => {
      this.apiBaseService.put(`media/albums/${this.object.id}`, this.object).subscribe(res => {
      });
    });
  }

  getMenuActions() {
    return {
      add: {
        active: true,
        permission: mediaConstants.SHARING_PERMISSIONS.OWNER,
        inDropDown: false, // Outside dropdown list
        action: () => {
          this.openSelectedModal();
        },
        class: 'btn btn-default',
        liclass: 'hidden-xs',
        tooltip: this.tooltip.addPhotos,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-plus-square'
      },
      share: {
        active: true,
        permission: mediaConstants.SHARING_PERMISSIONS.EDIT,
        inDropDown: false, // Outside dropdown list
        action: () => {
          this.openModalShareParent();
        },
        class: 'btn btn-default',
        liclass: 'hidden-xs',
        tooltip: this.tooltip.share,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-share-alt'
      },
      shareMobile: {
        active: true,
        permission: mediaConstants.SHARING_PERMISSIONS.EDIT,
        inDropDown: true, // Inside dropdown list
        action: () => { },
        class: '',
        liclass: 'visible-xs-block',
        tooltip: this.tooltip.share,
        title: 'Share',
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-share-alt'
      },
      favorite: {
        active: true,
        permission: mediaConstants.SHARING_PERMISSIONS.VIEW,
        inDropDown: false, // Outside dropdown list
        action: this.toggleFavoriteParent.bind(this),
        class: 'btn btn-default',
        liclass: '',
        tooltip: this.tooltip.addToFavorites,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-star'
      },
      delete: {
        active: true,
        permission: mediaConstants.SHARING_PERMISSIONS.VIEW,
        inDropDown: false, // Outside dropdown list
        action: this.deleteParent.bind(this),
        class: 'btn btn-default',
        liclass: 'hidden-xs',
        tooltip: this.tooltip.delete,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-trash'
      },
      edit: {
        active: true,
        permission: mediaConstants.SHARING_PERMISSIONS.EDIT,
        inDropDown: true, // Outside dropdown list
        action: () => {
          this.openEditModal(this.object);
        },
        class: '',
        liclass: '',
        title: 'Edit Information',
        tooltip: this.tooltip.edit,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-edit'
      },
      info: {
        active: true,
        permission: mediaConstants.SHARING_PERMISSIONS.VIEW,
        inDropDown: true, // Outside dropdown list
        action: this.toggleInfoCustom.bind(this),
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
        action: this.downloadMediaCustom.bind(this),
        class: '',
        liclass: '',
        title: 'Download',
        tooltip: this.tooltip.info,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-download'
      },
      deleteMobile: {
        active: true,
        permission: mediaConstants.SHARING_PERMISSIONS.VIEW,
        inDropDown: true, // Inside dropdown list
        action: () => { },
        class: '',
        liclass: 'visible-xs-block',
        title: 'Delete',
        tooltip: this.tooltip.info,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-trash'
      }
    };
  }

  getSubMenuActions() {
    return {
      // active_drop: true,
      preview: {
        active: true,
        permission: mediaConstants.SHARING_PERMISSIONS.VIEW,
        inDropDown: false, // Outside dropdown list
        action: this.viewDetail.bind(this),
        class: 'btn btn-default',
        liclass: 'hidden-xs',
        tooltip: this.tooltip.preview,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-eye'
      },
      share: {
        active: true,
        permission: mediaConstants.SHARING_PERMISSIONS.OWNER,
        inDropDown: false, // Outside dropdown list
        action: this.openModalShare.bind(this),
        class: 'btn btn-default',
        liclass: 'hidden-xs',
        tooltip: this.tooltip.share,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-share-alt'
      },
      shareMobile: {
        active: true,
        permission: mediaConstants.SHARING_PERMISSIONS.OWNER,
        inDropDown: true, // Inside dropdown list
        action: this.openModalShare.bind(this),
        class: '',
        liclass: 'visible-xs-block',
        tooltip: this.tooltip.share,
        title: 'Share',
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-share-alt'
      },
      favorite: {
        active: true,
        permission: mediaConstants.SHARING_PERMISSIONS.VIEW,
        inDropDown: false, // Outside dropdown list
        action: this.toggleFavorite.bind(this),
        class: 'btn btn-default',
        liclass: '',
        tooltip: this.tooltip.addToFavorites,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-star'
      },
      edit: {
        active: true,
        permission: mediaConstants.SHARING_PERMISSIONS.OWNER,
        inDropDown: true, // Outside dropdown list
        action: () => {
          this.openModalAddToAlbum(this.selectedObjects);
        },
        class: '',
        liclass: '',
        title: 'Add To Playlist',
        tooltip: this.tooltip.add,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-edit'
      },
      download: {
        active: true,
        permission: mediaConstants.SHARING_PERMISSIONS.DOWNLOAD,
        inDropDown: true, // Outside dropdown list
        action: this.downloadMediaCustom.bind(this),
        class: '',
        liclass: '',
        title: 'Download',
        tooltip: this.tooltip.info,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-download'
      },
      remove: {
        active: true,
        permission: mediaConstants.SHARING_PERMISSIONS.EDIT,
        inDropDown: true, // Outside dropdown list
        action: () => {
          this.selectedObjects = this.selectedObjects.map(el => { el._destroy = true; return { id: el.id, model: el.model, _destroy: el._destroy } })
          this.apiBaseService.put(`media/sharings/${this.object.id}/objects`, { objects: this.selectedObjects }).subscribe(res => {
            this.selectedObjects = [];
            this.hasSelectedObjects = false;
            this.loadObjects(this.object.uuid);
          });
        },
        class: '',
        liclass: '',
        title: 'Remove from share',
        tooltip: this.tooltip.remvoe,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-times'
      }
    };
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
