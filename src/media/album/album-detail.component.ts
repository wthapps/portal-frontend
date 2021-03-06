import {
  Component,
  OnInit,
  OnDestroy,
  ComponentFactoryResolver,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import {
  ApiBaseService,
  CommonEventService,
  UrlService
} from '@shared/services';
import { Constants } from '@wth/shared/constant';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';
import { ToastsService } from '@shared/shared/components/toast/toast-message.service';
import { LoadModalAble } from '@shared/shared/mixins/modal/load-modal-able.mixin';
import { Mixins } from '@shared/design-patterns/decorator/mixin-decorator';
import { Location } from '@angular/common';
import { MediaDetailInfoComponent } from '@media/shared/media/media-detail-info.component';
import { mediaConstants } from '@media/shared/config/constants';
import { WMediaSelectionService } from '@shared/components/w-media-selection/w-media-selection.service';
import { WUploader } from '@shared/services/w-uploader';
import { takeUntil, filter } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

import { BsModalComponent } from 'ng2-bs3-modal';
import { LocalStorageService } from 'angular-2-local-storage';
import { SharingModalMixin } from '@shared/modules/photo/components/modal/sharing/sharing-modal.mixin';
import { MediaAddModalService } from '@shared/modules/photo/components/modal/media/media-add-modal.service';
import { MediaCreateModalService } from '@shared/modules/photo/components/modal/media/media-create-modal.service';
import { SharingModalService } from '@shared/modules/photo/components/modal/sharing/sharing-modal.service';
import { MediaRenameModalComponent } from '@shared/modules/photo/components/modal/media/media-rename-modal.component';
import { SharingModalResult, SharingCreateParams } from '@shared/modules/photo/components/modal/sharing/sharing-modal';
import { MediaBasicListMixin, MediaAdditionalListMixin, MediaListDetailMixin, AlbumAddMixin, MediaModalMixin, MediaParentMixin, MediaDownloadMixin } from '@shared/modules/photo/mixins';
import Sharing from '@shared/modules/photo/models/sharing.model';
import MediaList from '@shared/modules/photo/models/list-functions/media-list.model';
import Album from '@shared/modules/photo/models/album.model';
import { MediaType } from '@shared/modules/photo/models/interfaces/media';

declare var _: any;
@Mixins([
  MediaBasicListMixin,
  MediaAdditionalListMixin,
  MediaListDetailMixin,
  LoadModalAble,
  SharingModalMixin,
  AlbumAddMixin,
  MediaModalMixin,
  MediaParentMixin,
  MediaDownloadMixin
])
@Component({
  templateUrl: '../shared/list/parent-detail.component.html',
  styleUrls: ['album-detail.component.scss'],
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
  MediaParentMixin,
  MediaDownloadMixin {
  objects: Array<MediaType>;
  cloneObjects: any;
  object: Album;
  recipients: any;
  sharingOwner: any;
  hasSelectedObjects: boolean;
  selectedObjects: any = [];
  selectedCoverObjects: any = [];
  favoriteAll: any;
  loading: boolean;
  tooltip: any = Constants.tooltip;
  viewModes: any = { grid: 'grid', list: 'list', timeline: 'timeline' };
  viewMode: any = this.viewModes.grid;
  links: any;
  showDetailsInfo: any;
  sorting: any;
  sharings: any;
  moreRecipients: any;
  // ============
  titleNoData: any = 'There are no items in this albums!';
  actionNoData: any = 'Add items';
  iconNoData: any = 'fa fa-file-image-o';
  // ===========
  menuActions: any = {};
  parentMenuActions: any = {};
  subMenuActions: any = {};
  modalIns: any;
  modalRef: any;
  // ============
  subSelect: any;
  subAddAlbum: any;
  subOpenCreateAlbum: any;
  subCreateAlbum: any;
  endLoading: any;
  returnUrls: any = [];
  destroy$ = new Subject();
  title: string = 'Album Detail';
  // ============

  @ViewChild('modalContainer', { read: ViewContainerRef }) modalContainer: ViewContainerRef;
  @ViewChild('mediaInfo') mediaInfo: MediaDetailInfoComponent;
  @ViewChild('coverModal') coverModal: BsModalComponent;

  private uploadingFiles: Array<any> = [];
  private objectType = 'Media::Photo';


  constructor(public mediaAddModalService: MediaAddModalService,
    public mediaCreateModalService: MediaCreateModalService,
    public sharingModalService: SharingModalService,
    public toastsService: ToastsService,
    public apiBaseService: ApiBaseService,
    public resolver: ComponentFactoryResolver,
    public confirmService: WthConfirmService,
    public commonEventService: CommonEventService,
    public mediaSelectionService: WMediaSelectionService,
    public router: Router,
    public route: ActivatedRoute,
    public location: Location,
    public localStorageService: LocalStorageService,
    public urlService: UrlService,
    private uploader: WUploader) { }

  ngOnInit() {
    this.route.params.subscribe(p => {
      this.parentMenuActions = this.getMenuActions();
      this.subMenuActions = this.getSubMenuActions();
      this.menuActions = this.parentMenuActions;
      this.loadObjects(p.uuid);
      this.loadObject(p.uuid);
    });
    this.returnUrls = this.route.snapshot.queryParams.returnUrls;
    this.viewMode = this.localStorageService.get('media_view_mode') || this.viewModes.grid;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  doListEvent(event: any) {
    switch (event.action) {
      case 'viewDetails':
        this.viewDetail();
        break;
      case 'favorite':
        this.toggleFavorite(event.payload);
        break;
      case 'getMore':
        this.loadMoreObjects();
        break;
      case 'sort':
        this.sorting = event.payload.queryParams;
        this.loadObjects(this.object.uuid, this.sorting);
        break;
      case 'noData':
        this.openSelectedModal();
        break;
      case 'clickOnItem':
      case 'clickOnCircle':
        this.selectedObjectsChanged();
        break;
    }
  }

  doCoverEvent(event: any) {
    switch (event.action) {
      case 'favorite':
        this.toggleFavorite(event.payload);
        break;
      case 'getMore':
        this.loadMoreObjects();
        break;
      case 'sort':
        this.sorting = event.payload.queryParams;
        this.loadObjects(this.object.uuid, this.sorting);
        break;
      case 'clickOnItem':
      case 'clickOnCircle':
        this.selectedObjectsCoverChanged();
        break;
    }
  }

  selectedObjectsCoverChanged() {
    this.selectedCoverObjects = this.cloneObjects.filter(ob => ob.selected === true);
  }

  setCover(event) {
    this.apiBaseService.put('media/albums/' + this.object.id, { thumbnail_url: this.selectedCoverObjects[0].thumbnail_url })
      .subscribe(res => {
        this.doToolbarCoverEvent({ action: 'close' });
        this.coverModal.close();
        this.toastsService.success('Set cover image successfully');
      });
  }

  doToolbarCoverEvent(event: any) {
    if (event.action === 'close') {
      this.cloneObjects = this.cloneObjects.map(ob => {
        ob.selected = false;
        return ob;
      });
      this.selectedCoverObjects = [];
    }
  }

  openSelectedModal() {
    // this.mediaSelectionService.setMultipleSelection(true);
    this.mediaSelectionService.open({
      hiddenTabs: ['videos', 'playlists'],
      selectedTab: 'photos',
      filter: 'all',
      allowCancelUpload: true,
      allowedFileTypes: ['image/*']
    });
    if (this.subSelect) { this.subSelect.unsubscribe(); }
    this.subSelect = this.mediaSelectionService.selectedMedias$.pipe(
      filter(photos => photos.length > 0)
    ).pipe(takeUntil(this.destroy$)).subscribe(photos => {
      this.onAddToAlbum({ parents: [this.object], children: photos });
      // this.objects = [...photos.filter(p => p.model === this.objectType), ...this.objects];
      // this.loadObjects(this.object.uuid);
    });

    this.uploader.event$.pipe(takeUntil(this.destroy$)).subscribe(event => {
      this.handleUploadFiles(event);
    });
  }

  onAddedToAlbum(data: any) {
    this.loadObjects(this.object.uuid);
  }

  handleUploadFiles(event: any) {
    switch (event.action) {
      case 'start':
        this.uploadingFiles = [];
        break;
      case 'success':
        const file = event.payload.resp.data;
        this.uploadingFiles.push(file);
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
        this.apiBaseService.post(`media/playlists/add_to_playlist`, {
          playlist: { id: this.object.id },
          videos: [e.payload]
        }).subscribe(res => {
          this.loadObjects(this.object.uuid);
        });
        break;
      case 'changeView':
        this.changeViewMode(e.payload);
        break;
    }
  }

  loadObjects(input: any, opts: any = {}) {
    this.loading = true;
    // opts = { ...opts, model: 'Media::Album' };
    this.sorting = { sort_name: opts.sort_name || 'Date', sort: opts.sort || 'desc' };
    this.objects = [];
    this.apiBaseService.get(`media/albums/${input}/objects`, opts).toPromise().then(res => {
      this.objects = MediaList.map(res.data);
      this.cloneObjects = _.cloneDeep(this.objects);
      this.links = res.meta.links;
      this.loading = false;
      this.loadingEnd();
    });
  }

  openModalAddToAlbum: (selectedObjects: any) => void;
  onAddToAlbum: (e: any) => void;
  openCreateAlbumModal: (selectedObjects: any) => void;
  onDoneAlbum: (e: any) => void;

  loadObject(input: any) {
    this.apiBaseService.get(`media/albums/${input}`).subscribe(res => {
      this.object = new Album(res.data);
      if (this.object.favorite) {
        this.menuActions.favorite.iconClass = 'fa fa-star';
      } else {
        this.menuActions.favorite.iconClass = 'fa fa-star-o';
      }
      this.validateActions(this.subMenuActions, this.object.recipient ? this.object.recipient.role_id :
        mediaConstants.SHARING_PERMISSIONS.OWNER);
      this.validateActions(this.parentMenuActions, this.object.recipient ? this.object.recipient.role_id :
        mediaConstants.SHARING_PERMISSIONS.OWNER);
    });
  }
  validateActions: (menuActions: any, role_id: number) => any;

  loadMoreObjects(input?: any) {
    if (this.links && this.links.next) {
      this.apiBaseService.get(this.links.next).subscribe(res => {
        this.objects = [...this.objects, ...MediaList.map(res.data)];
        this.cloneObjects = _.cloneDeep(this.objects);
        this.links = res.meta.links;
        this.loadingEnd();
      });
    }
  }

  loadingEnd: () => void;

  viewDetail() {
    const data: any = {
      returnUrls: [...this.returnUrls, `/albums/${this.object.uuid}`], model: this.selectedObjects[0].object_type,
      preview: true, parent_id: this.object.id
    };
    if (this.selectedObjects && this.selectedObjects.length > 1) { data.ids = this.selectedObjects.map(s => s.id).join(','); }
    this.router.navigate([`/photos/${this.selectedObjects[0].uuid}`],
      { queryParams: data });
  }

  doNoData() {
    throw new Error('should overwrite this method');
  }

  back: () => void;

  editName(object: any) {
    this.loadModalComponent(MediaRenameModalComponent);
    this.modalIns.open({ selectedObject: this.object });
    this.modalIns.event.subscribe(e => {
      this.apiBaseService.put(`media/albums/${this.object.id}`, this.object).subscribe(res => {
      });
    });
  }

  selectedObjectsChanged: (objectsChanged?: any) => void;

  onListChanges(e: any) {
    switch (e.action) {
      case 'favorite':
        // this.menuActions.favorite.iconClass = this.favoriteAll ? 'fa fa-star' : 'fa fa-star-o';
        break;
      case 'selectedObjectsChanged':
        if (this.object.model === 'Media::Playlist' || this.object.model === 'Media::Video') {
          this.subMenuActions.edit.title = 'Add to Playlist';
          this.subMenuActions.remove.title = 'Remove from Playlist';
        } else {
          this.subMenuActions.edit.title = 'Add to Album';
          this.subMenuActions.remove.title = 'Remove from Album';
        }
        this.menuActions = this.hasSelectedObjects ? this.subMenuActions : this.parentMenuActions;
        this.subMenuActions.favorite.iconClass = this.selectedObjects.every(s => s.favorite) ? 'fa fa-star' : 'fa fa-star-o';
        if (this.selectedObjects.length > 0) this.showDetailsInfo = false;
        break;
      default:
        break;
    }
  }

  loadModalComponent: (component: any) => void;
  toggleInfo: () => void;

  toggleFavorite(items?: any) {
    let data = this.selectedObjects;
    if (items) { data = items; }
    this.apiBaseService.post(`media/favorites/toggle`, {
      objects: data
        .map(v => ({ id: v.id, object_type: v.model }))
    }).subscribe(res => {
      this.objects = this.objects.map(v => {
        const tmp = res.data.filter(d => d.id === v.id);
        if (tmp && tmp.length > 0) {
          v.favorite = tmp[0].favorite;
        }
        return v;
      });
      this.subMenuActions.favorite.iconClass = this.selectedObjects.every(s => s.favorite) ? 'fa fa-star' : 'fa fa-star-o';
    });
  }

  deSelect() {
    this.objects.forEach(ob => {
      ob.selected = false;
    });
    this.selectedObjects = [];
    this.hasSelectedObjects = false;
    this.selectedObjectsChanged();
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
        });
      }
    });
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
          });
        }
      });
    } else {
      this.confirmService.confirm({
        header: 'Delete',
        acceptLabel: 'Delete',
        message: `Are you sure to delete this album`,
        accept: () => {
          this.loading = true;
          this.apiBaseService.post(`media/media/delete`, { objects: [this.object] }).subscribe(res => {
            this.back();
          });
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
    this.apiBaseService.post(`media/playlists/remove_from_playlist`, {
      playlist: { id: this.object.id },
      videos: this.selectedObjects.map(ob => ({ id: ob.id, model: ob.model }))
    }).subscribe(res => {
      this.toastsService.success('You removed videos successfully!');
      this.loadObjects(this.object.uuid);
      this.selectedObjects = [];
      this.hasSelectedObjects = false;
    });
  }

  openModalShareParent() {
    this.openModalShare([this.object]);
  }

  openModalShare: (input: any) => void;

  onSaveShare(sharing: Sharing) {
    if (sharing.isSharingAlbum()) {
      this.object.sharing_id = sharing.id;
      this.object.recipients_count = sharing.recipients_count;
    }
    this.toastsService.success("success");
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
  getSharingParentInfo: (sharingId: any) => void;

  openEditModal: (object: any) => void;
  onAfterEditModal() {
    this.modalIns.event.subscribe(e => {
      this.apiBaseService.put(`media/albums/${this.object.id}`, this.object).subscribe(res => {
      });
    });
  }

  showMoreRecipients() {
    this.recipients = [...this.recipients, ...this.moreRecipients];
    this.moreRecipients = null;
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
        tooltip: this.tooltip.addItems,
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
      preview: {
        active: true,
        // needPermission: 'view',
        inDropDown: true, // Outside dropdown list
        action: () => {
          this.selectedObjects = [this.objects[0]];
          this.viewDetail();
          this.selectedObjects = [];
        },
        class: '',
        liclass: '',
        title: 'Preview',
        tooltip: this.tooltip.edit,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-eye'
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
      cover: {
        active: true,
        inDropDown: true, // Outside dropdown list
        action: () => {
          // this.openEditModal(this.selectedObjects[0]);
          this.coverModal.open();
        },
        class: '',
        liclass: '',
        title: 'Set cover image',
        tooltip: this.tooltip.edit,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-file-image-o'
      },
      info: {
        active: true,
        permission: mediaConstants.SHARING_PERMISSIONS.VIEW,
        inDropDown: false, // Outside dropdown list
        action: () => {
          this.toggleInfo();
          if (this.object.sharing_id) {
            this.getSharingParentInfo(this.object.sharing_id);
          }
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
          this.selectedObjects = this.selectedObjects.map(el => {
            el._destroy = true;
            return { id: el.id, model: el.model, _destroy: el._destroy };
          });
          this.apiBaseService.put(`media/albums/${this.object.id}/objects`, { objects: this.selectedObjects }).subscribe(res => {
            this.objects = this.objects.filter(ob => ob.selected !== true);
            this.selectedObjectsChanged(this.objects);
            this.loadObjects(this.object.uuid);
          });
        },
        class: '',
        liclass: '',
        title: 'Remove from Album',
        tooltip: this.tooltip.remvoe,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-times'
      }
    };
  }
}
