import { Component, OnDestroy, OnInit, ViewContainerRef, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  ApiBaseService,
  WthConfirmService
} from '@wth/shared/services';
import { Mixins  } from '@shared/design-patterns/decorator/mixin-decorator';
import { MediaBasicListMixin } from '@shared/mixin/media-basic-list.mixin';
import { MediaAdditionalListMixin } from '@shared/mixin/media-additional-list.mixin';
import { Constants } from '@shared/constant';
import { MediaListDetailMixin } from '@shared/mixin/media-list-detail.mixin';
import { Location } from '@angular/common';
import { LoadModalAble } from '@shared/shared/mixins/modal/load-modal-able.mixin';
import { MediaRenameModalComponent } from '@shared/shared/components/photo/modal/media/media-rename-modal.component';
import { SharingModalMixin } from '@shared/shared/components/photo/modal/sharing/sharing-modal.mixin';
import { SharingModalService } from '@shared/shared/components/photo/modal/sharing/sharing-modal.service';
import { ToastsService } from '@shared/shared/components/toast/toast-message.service';
import { SharingCreateParams, SharingModalResult } from '@shared/shared/components/photo/modal/sharing/sharing-modal';
import { PlaylistAddMixin } from '@shared/mixin/playlist/playlist-add.mixin';
import { MediaAddModalService } from '@shared/shared/components/photo/modal/media/media-add-modal.service';
import { MediaCreateModalService } from '@shared/shared/components/photo/modal/media/media-create-modal.service';
import { MediaDownloadMixin } from '@shared/mixin/media-download.mixin';
import { mediaConstants } from '@media/shared/conig/constants';
import { LocationCustomService } from '@media/shared/service/location-custom.service';
import { WMediaSelectionService } from '@shared/components/w-media-selection/w-media-selection.service';
import { AsyncScheduler } from 'rxjs/scheduler/AsyncScheduler';
import { MediaModalMixin } from '@shared/mixin/media-modal.mixin';
import { MediaDetailInfoComponent } from '@media/shared/media/media-detail-info.component';
import { WUploader } from '@shared/services/w-uploader';
import { MediaParentMixin } from '@shared/mixin/media-parent.mixin';

@Mixins([MediaBasicListMixin,
  MediaAdditionalListMixin,
  MediaListDetailMixin,
  LoadModalAble,
  SharingModalMixin,
  PlaylistAddMixin,
  MediaModalMixin,
  MediaParentMixin,
  MediaDownloadMixin])
@Component({
  selector: 'playlist-detail',
  templateUrl: '../shared/list/parent-detail.component.html',
  styleUrls: ['playlist-detail.component.scss']
})
export class ZPlaylistDetailComponent implements OnInit, OnDestroy,
MediaListDetailMixin,
MediaBasicListMixin,
MediaAdditionalListMixin,
MediaModalMixin,
LoadModalAble,
SharingModalMixin,
PlaylistAddMixin, MediaDownloadMixin {
  objects: any;
  object: any;
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
  titleNoData: any = 'There is no video!';
  subTitleNoData: any = 'Try to add new videos';
  actionNoData: any = 'Add videos';
  uploadMode: any = 'multiple';
  uploadType: any = 'video/*';
  // ===========
  menuActions: any = {};
  parentMenuActions: any = {};
  subMenuActions: any = {};
  modalIns: any;
  modalRef: any;
  sorting: any;
  // ============
  subAddPlaylist: any;
  subOpenCreatePlaylist: any;
  subCreatePlaylist: any;
  subSelect: any;
  returnUrl: any;
  sharings: any;
  endLoading: any;
  // ============
  @ViewChild('modalContainer', { read: ViewContainerRef }) modalContainer: ViewContainerRef;
  @ViewChild('mediaInfo') mediaInfo: MediaDetailInfoComponent;
  private destroy$ = new Subject();
  private uploadingFiles: Array<any> = [];
  private objectType = 'Media::Video';

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
    public locationCustomService: LocationCustomService,
    public location: Location,
    private uploader: WUploader) { }

  validateActions: (menuActions: any, role_id: number) => any;
  openModalShare: (input: any) => void;
  loadModalComponent: (component: any) => void;
  onEditShare: (e: SharingModalResult, sharing: any) => void;
  openModalAddToPlaylist: (selectedObjects: any) => void;
  onAddToPlaylist: (e: any) => void;
  downloadMedia: (media: any) => void;
  openCreatePlaylistModal: (selectedObjects: any) => void;
  toggleInfo: () => void;
  loadingEnd: () => void;

  openEditModal:(object: any) => void;
  onAfterEditModal() {
    const sub = this.modalIns.event.subscribe(event => {
      this.apiBaseService.put(`media/playlists/${event.params.selectedObject.id}`, event.params.selectedObject).subscribe(res => {
        if (sub) sub.unsubscribe();
      })
    });
  }

  onAddedToPlaylist(data: any) {
    this.loadObjects(this.object.uuid);
  };

  ngOnInit() {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(p => {
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
        this.viewDetail(this.object.uuid);
        break;
      case 'favorite':
        this.toggleFavorite(e.payload);
        break;
      case 'sort':
        this.sorting = e.payload.queryParams;
        this.loadObjects(this.object.uuid, this.sorting);
        break;
    }
  }

  doToolbarEvent(e: any) {
    switch (e.action) {
      case 'uploaded':
        this.apiBaseService.post(`media/playlists/add_to_playlist`, {
          playlist: {id: this.object.id}, videos: [e.payload]}).subscribe(res => {
          this.loadObjects(this.object.uuid);
        });
        break;
      case 'changeView':
        this.changeViewMode(e.payload);
      break;
      case 'openMediaSelectModal':
        this.openSelectedModal();
        break;
    }
  }

  onListChanges(e: any) {
    switch (e.action) {
      case 'favorite':
        // this.menuActions.favorite.iconClass = this.favoriteAll ? 'fa fa-star' : 'fa fa-star-o';
        break;
      case 'selectedObjectsChanged':
        // this.menuActions.favorite.iconClass = this.favoriteAll ? 'fa fa-star' : 'fa fa-star-o';
        break;
      default:
        break;
    }
  }

  loadObjects(input: any, opts: any = {}) {
    this.loading = true;
    opts = { ...opts, model: 'Media::Album' };
    this.sorting = { sort_name: opts.sort_name || "Date", sort: opts.sort || "desc" };
    this.apiBaseService.get(`media/playlists/${input}/videos`, opts).subscribe(res => {
      this.objects = res.data;
      this.links = res.meta.links;
      this.loading = false;
      this.loadingEnd();
    });
  }

  loadObject(input: any) {
    this.apiBaseService.get(`media/playlists/${input}`).subscribe(res => {
      this.object = res.data;
      this.parentMenuActions.favorite.iconClass = res.data.favorite ? 'fa fa-star' : 'fa fa-star-o';
      this.validateActions(this.subMenuActions,
        this.object.permission ? this.object.permission.role_id : mediaConstants.SHARING_PERMISSIONS.OWNER);
      this.validateActions(this.parentMenuActions,
        this.object.permission ? this.object.permission.role_id : mediaConstants.SHARING_PERMISSIONS.OWNER);
    });
  }

  loadMoreObjects:(input?: any) => void;

  viewDetail(input: any) {
    const data: any = { returnUrl: `/playlists/${input}`, preview: true, parent_id: this.object.id };
    if (this.selectedObjects && this.selectedObjects.length > 1) { data.ids = this.selectedObjects.map(s => s.id).join(','); }
    this.router.navigate([`/videos/${this.selectedObjects[0].uuid}`], { queryParams: data });
  }

  doNoData() {
    throw new Error('should overwrite this method');
  }

  back() {
    if (this.locationCustomService.links && this.locationCustomService.links.length > 0) {
      const back = this.locationCustomService.links.pop();
      this.router.navigate([back]);
    } else {
      this.router.navigate(['/playlists']);
    }
  }

  editName(object: any) {
    this.loadModalComponent(MediaRenameModalComponent);
    this.modalIns.open({selectedObject: this.object});
    this.modalIns.event.subscribe(e => {
      this.apiBaseService.put(`media/playlists/${this.object.uuid}`, this.object).subscribe(res => {
      });
    })
  }

  selectedObjectsChanged(objectsChanged: any) {
    if (this.objects) {
      this.objects.forEach(ob => {
        if (objectsChanged.some(el => el.id === ob.id && (el.object_type === ob.object_type || el.model === ob.model))) {
          ob.selected = true;
        } else {
          ob.selected = false;
        }
      });
      this.selectedObjects = this.objects.filter(v => v.selected === true);
      this.hasSelectedObjects = (this.selectedObjects && this.selectedObjects.length > 0) ? true : false;
      this.menuActions = this.hasSelectedObjects ? this.subMenuActions : this.parentMenuActions;
      this.subMenuActions.favorite.iconClass = this.selectedObjects.every(s => s.favorite) ? 'fa fa-star' : 'fa fa-star-o';
    }
  }

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
    this.selectedObjectsChanged(this.selectedObjects);
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

  changeViewMode(mode: any) {
    this.viewMode = mode;
  }

  toggleFavoriteParent() {
    this.toggleFavorite([this.object]);
    this.object.favorite = !this.object.favorite;
    this.menuActions.favorite.iconClass = this.object.favorite ? 'fa fa-star' : 'fa fa-star-o';
  }

  removeFromParent() {
    this.apiBaseService.post(`media/playlists/remove_from_playlist`,
    {playlist: {id: this.object.id}, videos: this.selectedObjects.map(ob => ({id: ob.id, model: ob.model}))}).subscribe(res => {
      this.toastsService.success('You removed videos successfully!');
      this.loadObjects(this.object.uuid);
      this.selectedObjects = [];
      this.hasSelectedObjects = false;
    });
  }

  openModalShareParent() {
    this.openModalShare([this.object.sharing_object]);
  }

  onSaveShare(e: any) {
    const objects = this.hasSelectedObjects ? this.selectedObjects : [this.object];
    const data: SharingCreateParams = {
      objects: objects.map(s => ({ id: s.id, model: s.model })),
      recipients: e.users,
      role_id: e.role.id
    };
    this.apiBaseService.post('media/sharings', data).subscribe(res => {
      this.toastsService.success('You have just create sharing successful');
    });
  }

  openModalAddToPlaylistCustom() {
    this.openModalAddToPlaylist(this.selectedObjects);
  }

  downloadMediaCustom() {
    if (this.selectedObjects && this.selectedObjects.length > 0) {
      this.downloadMedia(this.selectedObjects);
    }
  }

  onDonePlaylist(e: any) {
    console.log('You should overwrite this one', e);
  }

  openSelectedModal() {
    this.mediaSelectionService.open({
      allowedFileTypes: ['videos/*'],
      selectedTab: 'videos',
      hiddenTabs: ['photos', 'albums'],
      filter: 'video',
      allowCancelUpload: true,
      uploadButtonText: 'Upload videos',
      dragdropText: 'Drag your videos here'
    });
    if (this.subSelect) { this.subSelect.unsubscribe(); }

    this.subSelect = this.mediaSelectionService.selectedMedias$.filter((items: any[]) => items.length > 0)
      .subscribe(videos => {
        this.onAddToPlaylist({ parents: [this.object], children: videos });
        // this.objects = [...videos.filter(v => v.model === this.objectType), ...this.objects];
        this.loadObjects(this.object.uuid);
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
        if (file.content_type.startsWith('video')) {
          this.uploadingFiles.push({...file, model: this.objectType});
        }
        break;
      case 'complete':
        if (this.uploadingFiles.length > 0) {
          this.onAddToPlaylist({ parents: [this.object], children: this.uploadingFiles });
          this.objects = this.uploadingFiles;
        }
        break;
    }
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
        message: `Are you sure to delete this playlist`,
        accept: () => {
          this.loading = true;
          this.apiBaseService.post(`media/media/delete`, { objects: [this.object] }).subscribe(res => {
            this.back();
          })
        }
      });
    }
  }

  getSharingParentInfo: (sharingId: any) => void;

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
        tooltip: this.tooltip.addVideos,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-plus-square'
      },
      share: {
        active: true,
        permission: mediaConstants.SHARING_PERMISSIONS.OWNER,
        inDropDown: false, // Outside dropdown list
        action: this.openModalShareParent.bind(this),
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
        action: this.openModalShareParent.bind(this),
        class: '',
        liclass: 'visible-xs-block',
        tooltip: this.tooltip.share,
        title: 'Share',
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-share-alt'
      },
      favorite: {
        active: true,
        permission: mediaConstants.SHARING_PERMISSIONS.OWNER,
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
        permission: mediaConstants.SHARING_PERMISSIONS.OWNER,
        inDropDown: false, // Outside dropdown list
        action: () => {
          this.deleteParent();
        },
        class: 'btn btn-default',
        liclass: 'hidden-xs',
        tooltip: this.tooltip.delete,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-trash'
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
        title: 'Edit Information',
        tooltip: this.tooltip.edit,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-edit'
      },
      info: {
        active: true,
        permission: mediaConstants.SHARING_PERMISSIONS.OWNER,
        inDropDown: true, // Outside dropdown list
        action: () => {
          // this.mediaInfo.object = { ...this.object };
          this.toggleInfo();
          // this.apiBaseService.get(`media/object/${this.object.id}/sharings`, { model: 'Media::Playlist' }).subscribe(res => {
          //   this.sharings = res.data;
          // });
          if (this.object.sharing_object) {
            this.getSharingParentInfo(this.object.sharing_object.sharing_id);
          }
        },
        class: '',
        liclass: '',
        title: 'View Info',
        tooltip: this.tooltip.info,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-info-circle'
      },
      download: {
        active: true,
        permission: mediaConstants.SHARING_PERMISSIONS.OWNER,
        inDropDown: true, // Outside dropdown list
        action: () => {
          this.downloadMedia(this.objects);
        },
        class: '',
        liclass: '',
        title: 'Download',
        tooltip: this.tooltip.info,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-download'
      },
      deleteMobile: {
        active: true,
        permission: mediaConstants.SHARING_PERMISSIONS.OWNER,
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
      // preview: {
      //   active: true,
      //   // needPermission: 'view',
      //   inDropDown: false, // Outside dropdown list
      //   action: this.viewDetail.bind(this),
      //   class: 'btn btn-default',
      //   liclass: 'hidden-xs',
      //   tooltip: this.tooltip.preview,
      //   tooltipPosition: 'bottom',
      //   iconClass: 'fa fa-eye'
      // },
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
        permission: mediaConstants.SHARING_PERMISSIONS.OWNER,
        inDropDown: false, // Outside dropdown list
        action: this.toggleFavorite.bind(this),
        class: 'btn btn-default',
        liclass: '',
        tooltip: this.tooltip.addToFavorites,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-star'
      },
      // delete: {
      //   active: true,
      //   // needPermission: 'view',
      //   inDropDown: false, // Outside dropdown list
      //   action: this.removeFromParent.bind(this),
      //   class: 'btn btn-default',
      //   liclass: 'hidden-xs',
      //   tooltip: this.tooltip.tag,
      //   tooltipPosition: 'bottom',
      //   iconClass: 'fa fa-trash'
      // },
      edit: {
        active: true,
        permission: mediaConstants.SHARING_PERMISSIONS.OWNER,
        inDropDown: true, // Outside dropdown list
        action: this.openModalAddToPlaylistCustom.bind(this),
        class: '',
        liclass: '',
        title: 'Add To Playlist',
        tooltip: this.tooltip.add,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-edit'
      },
      download: {
        active: true,
        permission: mediaConstants.SHARING_PERMISSIONS.OWNER,
        inDropDown: true, // Outside dropdown list
        action: this.downloadMediaCustom.bind(this),
        class: '',
        liclass: '',
        title: 'Download',
        tooltip: this.tooltip.info,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-download'
      },
      // deleteMobile: {
      //   active: true,
      //   permission: mediaConstants.SHARING_PERMISSIONS.OWNER,
      //   inDropDown: true, // Inside dropdown list
      //   action: this.removeFromParent.bind(this),
      //   class: '',
      //   liclass: 'visible-xs-block',
      //   title: 'Delete',
      //   tooltip: this.tooltip.info,
      //   tooltipPosition: 'bottom',
      //   iconClass: 'fa fa-trash'
      // },
      remove: {
        active: true,
        permission: mediaConstants.SHARING_PERMISSIONS.EDIT,
        inDropDown: true, // Outside dropdown list
        action: () => {
          this.selectedObjects = this.selectedObjects.map(el => { el._destroy = true; return { id: el.id, model: el.model, _destroy: el._destroy } })
          this.apiBaseService.put(`media/playlists/${this.object.id}/objects`, { objects: this.selectedObjects }).subscribe(res => {
            this.toastsService.success('You removed videos successfully!');
            this.selectedObjects = [];
            this.hasSelectedObjects = false;
            this.selectedObjectsChanged(this.selectedObjects);
            this.loadObjects(this.object.uuid);
          })
        },
        class: '',
        liclass: '',
        title: 'Remove from Playlist',
        tooltip: this.tooltip.remvoe,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-times'
      }
    };
  }

  ngOnDestroy() {
    if (this.subSelect) {
      this.subSelect.unsubscribe();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }
}
