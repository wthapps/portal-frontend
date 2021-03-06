import {
  Component,
  OnInit,
  OnDestroy,
  ComponentFactoryResolver,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

import { ApiBaseService, CommonEventService } from '@shared/services';
import { Download } from '../shared/store/media/media.actions';
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
import { LocalStorageService } from 'angular-2-local-storage';
import { SharingModalMixin } from '@shared/modules/photo/components/modal/sharing/sharing-modal.mixin';
import { MediaAddModalService } from '@shared/modules/photo/components/modal/media/media-add-modal.service';
import { MediaCreateModalService } from '@shared/modules/photo/components/modal/media/media-create-modal.service';
import { SharingModalService } from '@shared/modules/photo/components/modal/sharing/sharing-modal.service';
import { MediaRenameModalComponent } from '@shared/modules/photo/components/modal/media/media-rename-modal.component';
import { SharingModalResult, SharingCreateParams } from '@shared/modules/photo/components/modal/sharing/sharing-modal';
import { MediaBasicListMixin, MediaAdditionalListMixin, MediaListDetailMixin, MediaParentMixin, MediaModalMixin, MediaDownloadMixin } from '@shared/modules/photo/mixins';
import { PlaylistAddMixin } from '@shared/modules/photo/mixins/playlist/playlist-add.mixin';
import Sharing from '@shared/modules/photo/models/sharing.model';

@Mixins([
  MediaBasicListMixin,
  MediaAdditionalListMixin,
  MediaListDetailMixin,
  LoadModalAble,
  SharingModalMixin,
  PlaylistAddMixin,
  MediaParentMixin,
  MediaModalMixin,
  MediaDownloadMixin
])
@Component({
  moduleId: module.id,
  selector: 'me-sharing-detail',
  styleUrls: ['sharing-detail.component.scss'],
  templateUrl: '../shared/list/parent-detail.component.html'
})
export class ZMediaSharingDetailComponent
  implements
  OnInit,
  OnDestroy,
  MediaListDetailMixin,
  MediaBasicListMixin,
  MediaAdditionalListMixin,
  LoadModalAble,
  SharingModalMixin,
  MediaModalMixin,
  PlaylistAddMixin,
  MediaDownloadMixin {
  returnUrls: any = ["/"];
  objects: any;
  object: Sharing;
  cloneObjects: any;
  recipients: any;
  hasSelectedObjects: boolean;
  selectedCoverObjects: any = [];
  selectedObjects: any = [];
  favoriteAll: any;
  loading: boolean;
  tooltip: any = Constants.tooltip;
  viewModes: any = { grid: 'grid', list: 'list', timeline: 'timeline' };
  viewMode: any = this.viewModes.grid;
  links: any;
  sorting: any;
  showDetailsInfo: any;
  // ============
  titleNoData: any = 'There are no sharings!';
  iconNoData: any = 'fa fa-share-alt';
  // ===========
  menuActions: any = {};
  parentMenuActions: any = {};
  subMenuActions: any = {};
  modalIns: any;
  modalRef: any;
  // ============
  subAddPlaylist: any;
  subOpenCreatePlaylist: any;
  subCreatePlaylist: any;
  subUpload: any;
  subSelect: any;
  endLoading: any;
  disableMoreAction: boolean;
  destroy$ = new Subject();
  title: string = 'Shares';
  // ============
  @ViewChild('modalContainer', { read: ViewContainerRef }) modalContainer: ViewContainerRef;
  @ViewChild('mediaInfo') mediaInfo: MediaDetailInfoComponent;

  private uploadingFiles: Array<any> = [];
  private photoSharingTypes: Array<any> = ['Media::Photo', 'Media::Album'];
  private videoSharingTypes: Array<any> = ['Media::Media', 'Media::Playlist'];

  constructor(public mediaAddModalService: MediaAddModalService,
    public mediaCreateModalService: MediaCreateModalService,
    public sharingModalService: SharingModalService,
    public toastsService: ToastsService,
    public apiBaseService: ApiBaseService,
    public resolver: ComponentFactoryResolver,
    public confirmService: WthConfirmService,
    public mediaSelectionService: WMediaSelectionService,
    public router: Router,
    public commonEventService: CommonEventService,
    public localStorageService: LocalStorageService,
    public route: ActivatedRoute,
    public location: Location,
    private uploader: WUploader) { }

  onAddedToPlaylist: (data: any) => void;

  ngOnInit() {
    this.route.params.subscribe(p => {
      this.loadObjects(p.uuid);
      this.loadObject(p.uuid);
    });
    this.route.queryParams.subscribe(p => {
      this.returnUrls = p.returnUrls;
    });
    this.viewMode = this.localStorageService.get('media_view_mode') || this.viewModes.grid;
  }

  back: () => void;

  ngOnDestroy() {
    if (this.subUpload) { this.subUpload.unsubscribe(); }
    if (this.subSelect) { this.subSelect.unsubscribe(); }
    if (this.subAddPlaylist) { this.subAddPlaylist.unsubscribe(); }
    this.destroy$.next();
    this.destroy$.complete();
  }

  doListEvent(e: any) {
    switch (e.action) {
      case 'viewDetails':
        this.viewDetail();
        break;
      case 'favorite':
        this.toggleFavorite(e.payload);
        break;
      case 'getMore':
        this.loadMoreObjects(e.payload);
        break;
      case 'sort':
        this.sorting = e.payload.queryParams;
        this.loadObjects(this.object.uuid, this.sorting);
        break;
      case 'clickOnItem':
      case 'clickOnCircle':
        this.selectedObjectsChanged();
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

  loadObjects(input: any, opts: any = {}) {
    this.loading = true;
    this.sorting = { sort_name: opts.sort_name || "Date", sort: opts.sort || "desc" };
    this.objects = [];
    this.apiBaseService.get(`media/sharings/${input}/objects`, opts).subscribe(res => {
      this.objects = res.data;
      this.links = res.meta.links;
      this.loading = false;
      this.loadingEnd();
    });
  }

  loadObject(input: any) {
    this.apiBaseService.get(`media/sharings/${input}`).subscribe(res => {
      this.object = new Sharing(res.data);
      this.parentMenuActions = this.getMenuActions();
      this.subMenuActions = this.getSubMenuActions();
      this.menuActions = this.parentMenuActions;
      this.validateActions(this.subMenuActions, this.object.recipient ? this.object.recipient.role_id : mediaConstants.SHARING_PERMISSIONS.OWNER);
      this.validateActions(this.parentMenuActions, this.object.recipient ? this.object.recipient.role_id : mediaConstants.SHARING_PERMISSIONS.OWNER);
      this.disableMoreAction = (Object.keys(this.menuActions)
        .filter(el => (this.menuActions[el].inDropDown && this.menuActions[el].active && !this.menuActions[el].mobile)).length === 0);
    }, err => {
      if (err.status == 403) {
        this.confirmService.confirm({
          message:
            'This sharing you are looking for was deleted.',
          header: 'Sharing not found',
          rejectLabel: null,
          accept: () => {
            this.router.navigate(['/']);
          },
          reject: () => {
            this.router.navigate(['/']);
          }
        });
      } else {
        this.confirmService.confirm({
          message:
            'You don\'t have permission to access this sharing. Please contact the owner to gain permission.',
          header: 'Permission denied',
          rejectLabel: null,
          accept: () => {
            this.router.navigate(['/']);
          },
          reject: () => {
            this.router.navigate(['/']);
          }
        });
      }
    });
  }
  validateActions: (menuActions: any, role_id: number) => any;

  loadMoreObjects: (input?: any) => void;
  loadingEnd: (input?: any) => void;

  viewDetail(input?: any) {
    const data: any = {
      returnUrls: [...this.returnUrls, `/shared/${this.object.uuid}`], model: this.selectedObjects[0].object_type
    };
    this.router.navigate([`photos/`, this.selectedObjects[0].uuid], { queryParams: data });
  }

  openEditModal: (object: any) => void;
  onAfterEditModal() {
    this.modalIns.event.subscribe(e => {
      this.apiBaseService.put(`media/sharings/${this.object.id}`, this.object).subscribe(res => {
      });
    });
  }

  doNoData() {
    throw new Error('should overwrite this method');
  }

  doCoverEvent(event: any) {
  }

  selectedObjectsCoverChanged() {
  }

  setCover(event) {
  }

  doToolbarCoverEvent(event: any) {
  }

  editName(object: any) {
    this.loadModalComponent(MediaRenameModalComponent);
    this.modalIns.open({ selectedObject: this.object });
  }

  selectedObjectsChanged: (objectsChanged?: any) => void;

  onListChanges(e: any) {
    switch (e.action) {
      case 'favorite':
        // this.menuActions.favorite.iconClass = this.favoriteAll ? 'fa fa-star' : 'fa fa-star-o';
        // this.subMenuActions.favorite.iconClass = this.selectedObjects.every(s => s.favorite) ? 'fa fa-star' : 'fa fa-star-o';
        break;
      case 'selectedObjectsChanged':
        if (['Media::Playlist', 'Media::Video'].includes(this.object.object_type)) {
          this.subMenuActions.edit.title = 'Add to Playlist';
          this.subMenuActions.remove.title = 'Remove from Playlist';
        } else {
          this.subMenuActions.edit.title = 'Add to Album';
          this.subMenuActions.remove.title = 'Remove from Album';
        }
        this.menuActions = this.hasSelectedObjects ? this.subMenuActions : this.parentMenuActions;
        this.validateActions(this.menuActions, this.object.recipient ? this.object.recipient.role_id : mediaConstants.SHARING_PERMISSIONS.OWNER);
        // this.subMenuActions.favorite.iconClass = this.selectedObjects.every(s => s.favorite) ? 'fa fa-star' : 'fa fa-star-o';
        if (this.selectedObjects.length > 0) this.showDetailsInfo = false;
        this.disableMoreAction = (Object.keys(this.menuActions)
          .filter(el => (this.menuActions[el].inDropDown && this.menuActions[el].active && !this.menuActions[el].mobile)).length === 0);
        break;
      default:
        break;
    }
  }

  loadModalComponent: (component: any) => void;
  getSharingParentInfo: (sharingId: any) => void;
  toggleInfo: () => void;
  toggleInfoCustom() {
    this.getSharingParentInfo(this.object.id);
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
    })
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
        this.objects = this.objects.filter(ob => {
          return !this.selectedObjects.map(s => s.uuid).includes(ob.uuid);
        });
        this.apiBaseService.post(`media/media/delete`, { objects: this.selectedObjects }).subscribe(res => {
          this.loading = false;
          this.hasSelectedObjects = false;
          this.selectedObjects = [];
        })
      }
    })
  }

  deleteParent() {
    // console.log(this.object);
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
        message: `Are you sure to delete this sharing`,
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
    this.openModalShare([this.object]);
  }

  openModalShare: (input: any) => void;
  // onSaveShare: (sharing: Sharing) => void;
  onSaveShare(sharing: Sharing) {
    this.object.recipients_count = sharing.recipients_count;
    this.toastsService.success("success");
  };

  onEditShare: (e: SharingModalResult, sharing: any) => void;

  openModalAddToPlaylistCustom() {
    this.openModalAddToPlaylist(this.selectedObjects);
  }

  openModalAddToPlaylist: (selectedObjects: any) => void;

  onAddToPlaylist(e) {
    this.apiBaseService
      .post(`media/playlists/add_to_playlist`, {
        playlist: { id: e.parents[0].id },
        videos: e.children.map(c => { return { id: c.id, model: c.model } })
      })
      .subscribe(res => {
        this.toastsService.success('You just added to Playlist success');
      });
  }

  downloadMediaCustom() {
    if (this.selectedObjects && this.selectedObjects.length > 0) {
      this.downloadMedia(this.selectedObjects);
    } else {
      this.downloadMedia(this.objects);
    }
  }

  downloadMedia: (media: any) => void;

  openCreatePlaylistModal: (selectedObjects: any) => void;

  onDonePlaylist(e: any) {
    console.log('You should overwrite this one', e);
  }

  openSelectedModal() {

    let options: any;

    if (this.photoSharingTypes.includes(this.object.object_type)) {
      options = {
        selectedTab: 'photos',
        hiddenTabs: ['videos', 'playlists'],
        filter: 'photo',
        allowedFileType: ['image/*'],
        allowCancelUpload: true
      };
    } else if (this.videoSharingTypes.includes(this.object.object_type)) {
      options = {
        selectedTab: 'videos',
        hiddenTabs: ['photos', 'albums'],
        filter: 'video',
        allowedFileType: ['video/mp4', 'video/x-m4v', 'video/*'],
        allowCancelUpload: true,
        uploadButtonText: 'Upload videos',
        dragdropText: 'Drag your videos here'
      };
    }
    this.mediaSelectionService.open(options);

    if (this.subSelect) { this.subSelect.unsubscribe(); }
    if (this.subUpload) { this.subUpload.unsubscribe(); }
    this.subSelect = this.mediaSelectionService.selectedMedias$.pipe(filter((items: any[]) => items.length > 0))
      .subscribe(objects => {
        this.afterSelectMediaAction(this.object, objects);
      });

    this.uploader.event$.pipe(takeUntil(this.destroy$)).subscribe(event => {
      this.handleUploadFiles(event);
    });
  }

  afterSelectMediaAction(parent: any, children: any) {
    if (this.object.model === 'Common::Sharing') {
      if (this.videoSharingTypes.includes(this.object.object_type)) {
        this.apiBaseService.post(`media/sharings/${this.object.id}/objects`, {
          objects: children.filter(c => c.model === 'Media::Video')
        }).subscribe(res => {
          this.loadObjects(this.object.uuid);
        });
      }
      if (this.photoSharingTypes.includes(this.object.object_type)) {
        this.apiBaseService.post(`media/sharings/${this.object.id}/objects`, {
          objects: children.filter(c => c.model === 'Media::Photo')
        }).subscribe(res => {
          this.loadObjects(this.object.uuid);
        });
      }
    }
  }

  handleUploadFiles(event: any) {
    switch (event.action) {
      case 'start':
        this.uploadingFiles = [];
        break;
      case 'success':
        const file = event.payload.resp;

        // just allow allow files depend on sharing_type and file's content_type
        if (this.videoSharingTypes.includes(this.object.object_type) && file.content_type.startsWith('video')) {
          this.uploadingFiles.push({ ...file, model: 'Media::Video' });
        } else if (this.photoSharingTypes.includes(this.object.object_type) && file.content_type.startsWith('image')) {
          this.uploadingFiles.push({ ...file, model: 'Media::Photo' });
        }
        break;
      case 'complete':
        if (this.uploadingFiles.length > 0) {
          this.afterSelectMediaAction(this.object, this.uploadingFiles);
        }
        break;
    }
  }

  validateSharing() {

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
        action: this.openModalShareParent.bind(this),
        class: 'btn btn-default',
        liclass: 'hidden-xs',
        tooltip: this.tooltip.share,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-share-alt'
      },
      shareMobile: {
        active: true,
        mobile: true,
        permission: mediaConstants.SHARING_PERMISSIONS.EDIT,
        inDropDown: true, // Inside dropdown list
        action: () => {
          this.openSelectedModal();
        },
        class: '',
        liclass: 'visible-xs-block',
        tooltip: this.tooltip.share,
        title: 'Share',
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-share-alt'
      },
      // favorite: {
      //   active: true,
      //   permission: mediaConstants.SHARING_PERMISSIONS.VIEW,
      //   inDropDown: false, // Outside dropdown list
      //   action: this.toggleFavoriteParent.bind(this),
      //   class: 'btn btn-default',
      //   liclass: '',
      //   tooltip: this.tooltip.addToFavorites,
      //   tooltipPosition: 'bottom',
      //   iconClass: 'fa fa-star'
      // },
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
        action: () => { this.editName(this.object) },
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
        inDropDown: false, // Outside dropdown list
        action: this.toggleInfoCustom.bind(this),
        class: 'btn bt-default',
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
        mobile: true,
        permission: mediaConstants.SHARING_PERMISSIONS.VIEW,
        inDropDown: true, // Inside dropdown list
        action: this.deleteParent.bind(this),
        class: '',
        liclass: 'visible-xs-block',
        title: 'Delete',
        tooltip: this.tooltip.info,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-trash'
      }
    }
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
      // favorite: {
      //   active: true,
      //   permission: mediaConstants.SHARING_PERMISSIONS.OWNER,
      //   inDropDown: false, // Outside dropdown list
      //   action: this.toggleFavorite.bind(this),
      //   class: 'btn btn-default',
      //   liclass: '',
      //   tooltip: this.tooltip.addToFavorites,
      //   tooltipPosition: 'bottom',
      //   iconClass: 'fa fa-star'
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
          this.selectedObjects = this.selectedObjects.map(el => { el._destroy = true; return { id: el.id, model: el.model, _destroy: el._destroy } });
          this.apiBaseService.put(`media/sharings/${this.object.id}/objects`, { objects: this.selectedObjects }).subscribe(res => {
            this.selectedObjects = [];
            this.hasSelectedObjects = false;
            this.selectedObjectsChanged(this.selectedObjects);
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
    }
  }


}
