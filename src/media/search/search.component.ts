import {
  Component, ComponentFactoryResolver, OnInit, ViewChild,
  ViewContainerRef } from '@angular/core';
import * as appStore from '../shared/store';
import {
  Favorite,
  AddSuccess,
  DeleteMany,
  Search
} from '../shared/store/media/media.actions';
import { MediaUploaderDataService } from '@media/shared/uploader/media-uploader-data.service';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Constants } from '@wth/shared/constant';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';
import { ApiBaseService, DateService, CommonEventService } from '@shared/services';
import { ToastsService } from '@shared/shared/components/toast/toast-message.service';
import { Mixins } from '@shared/design-patterns/decorator/mixin-decorator';
import { SharingModalService } from '@shared/shared/components/photo/modal/sharing/sharing-modal.service';
import { WObjectListService } from '@shared/components/w-object-list/w-object-list.service';
import { MediaBasicListMixin } from '@shared/mixin/media-basic-list.mixin';
import { SharingModalMixin } from '@shared/shared/components/photo/modal/sharing/sharing-modal.mixin';
import { SharingModalResult } from '@shared/shared/components/photo/modal/sharing/sharing-modal';
import { MediaModalMixin } from '@shared/mixin/media-modal.mixin';
import { LocationCustomService } from '@media/shared/service/location-custom.service';
import { MediaDownloadMixin } from '@shared/mixin/media-download.mixin';
import { MediaCreateModalService } from '@shared/shared/components/photo/modal/media/media-create-modal.service';
import { mediaConstants } from '@media/shared/config/constants';
import { Location } from '@angular/common';
import { LocalStorageService } from 'angular-2-local-storage';

@Component({
  moduleId: module.id,
  selector: 'me-search',
  templateUrl: 'search.component.html'
})
@Mixins([MediaBasicListMixin])
export class ZMediaSearchComponent implements
  OnInit,
  // MediaListDetailMixin,
  MediaBasicListMixin,
  // MediaAdditionalListMixin,
  // SharingModalMixin,
  // PlaylistAddMixin,
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
  title: string = 'Search';
  // ============
  @ViewChild('modalContainer', { read: ViewContainerRef }) modalContainer: ViewContainerRef;

  private uploadingFiles: Array<any> = [];
  private photoSharingTypes: Array<any> = ['Media::Photo', 'Media::Album'];
  private videoSharingTypes: Array<any> = ['Media::Media', 'Media::Playlist'];

  constructor(
    // public mediaAddModalService: MediaAddModalService,
    public mediaCreateModalService: MediaCreateModalService,
    public sharingModalService: SharingModalService,
    public toastsService: ToastsService,
    public apiBaseService: ApiBaseService,
    public resolver: ComponentFactoryResolver,
    public confirmService: WthConfirmService,
    public localStorageService: LocalStorageService,

    public commonEventService: CommonEventService,
    public dateService: DateService,
    // public mediaSelectionService: WMediaSelectionService,
    public router: Router,
    public route: ActivatedRoute,
    public location: Location
    ) { }

  onAddedToPlaylist: (data: any) => void;

  ngOnInit() {
    this.route.queryParams.subscribe((p: any) => {
      this.loadObjects(p);
    });
    this.viewMode = this.localStorageService.get('media_view_mode') || this.viewModes.grid;
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
        this.loadObjects(this.sorting);
        // this.loadObjects();
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
        this.apiBaseService.post(`media/playlists/add_to_playlist`, { playlist: { id: this.object.id }, videos: [e.payload] })
        .subscribe(res => {
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
        // this.subMenuActions.favorite.iconClass = this.selectedObjects.every(s => s.favorite) ? 'fa fa-star' : 'fa fa-star-o';
        break;
      case 'selectedObjectsChanged':
        // this.menuActions = this.hasSelectedObjects ? this.subMenuActions : this.parentMenuActions;
        // this.subMenuActions.favorite.iconClass = this.selectedObjects.every(s => s.favorite) ? 'fa fa-star' : 'fa fa-star-o';
        break;
      default:
        break;
    }
  }

  async loadObjects(input: any) {
    const { queryParams } = this.route.snapshot;
    const new_input = { ...input, ...queryParams, sort_name: input.sort_name || 'Date', sort: input.sort || 'desc'};
    if (input.searchFrom || input.searchTo) {
      new_input.searchFrom = new Date(input.searchFrom);
      new_input.searchTo = new Date(input.searchTo);
    }

    const res = await this.apiBaseService.get(`media/search`, new_input).toPromise();
    this.objects = res.data;
    this.links = res.meta.links;
    this.loading = false;
    this.loadingEnd();
  }

  validateActions: (menuActions: any, role_id: number) => any;

  loadMoreObjects: (input?: any) => void;
  loadingEnd: (input?: any) => void;

  viewDetail(input?: any) {
    if (this.selectedObjects[0].object_type === 'Media::Photo') {
      this.router.navigate([`photos/`, this.selectedObjects[0].uuid]);
    } else if (this.selectedObjects[0].object_type === 'Media::Video') {
      this.router.navigate([`videos/`, this.selectedObjects[0].uuid]);
    } else {
      this.router.navigate([`albums/`, this.selectedObjects[0].uuid]);
    }
  }

  doNoData() {
    throw new Error('should overwrite this method');
  }

  back() {
    this.location.back();
  }

  // editName(object: any) {
  //   this.loadModalComponent(MediaRenameModalComponent);
  //   this.modalIns.open({ selectedObject: this.object });
  // }

  selectedObjectsChanged: (objectsChanged?: any) => void;

  loadModalComponent: (component: any) => void;
  getSharingParentInfo: (sharingId: any) => void;
  toggleInfo: () => void;
  toggleInfoCustom() {
    this.getSharingParentInfo(this.object.id);
    this.toggleInfo();
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
        });
      }
    });
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
          });
        }
      });
    } else {
      this.confirmService.confirm({
        header: 'Delete',
        acceptLabel: 'Delete',
        message: `Are you sure to delete this sharing`,
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
    this.apiBaseService.post(`media/playlists/remove_from_playlist`, { playlist: { id: this.object.id },
     videos: this.selectedObjects.map(ob => ({ id: ob.id, model: ob.model })) }).subscribe(res => {
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

  // onSaveShare(e: SharingModalResult) {
  //   const objects = this.hasSelectedObjects ? this.selectedObjects : [this.object];
  //   const data: SharingCreateParams = {
  //     objects: objects.map(s => { return { id: s.id, model: s.model } }),
  //     recipients: e.recipients.map(s => { return { role_id: s.role_id, recipient_id: s.user.id } }),
  //     role_id: e.role.id
  //   };
  //   this.apiBaseService.post('media/sharings', data).subscribe(res => {
  //     // this.toastsService.success('You have just create sharing successful');
  //     this.sharingModalService.update.next(res.data);
  //   });
  // }
  onEditShare: (e: SharingModalResult, sharing: any) => void;

  openModalAddToPlaylistCustom() {
    this.openModalAddToPlaylist(this.selectedObjects);
  }

  openModalAddToPlaylist: (selectedObjects: any) => void;

  onAddToPlaylist(e) {
    this.apiBaseService
      .post(`media/playlists/add_to_playlist`, {
        playlist: { id: e.parents[0].id },
        videos: e.children.map(c => ({ id: c.id, model: c.model }))
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

  afterSelectMediaAction(parent: any, children: any) {
    if (this.object.model === 'Common::Sharing') {
      if (this.videoSharingTypes.includes(this.object.model)) {
        this.apiBaseService.post(`media/sharings/${this.object.id}/objects`, {
          objects: children.filter(c => c.model === 'Media::Video')
        }).subscribe(res => {
          this.loadObjects(this.object.uuid);
        });
      }
      if (this.photoSharingTypes.includes(this.object.model)) {
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
        if (this.videoSharingTypes.includes(this.object.model) && file.content_type.startsWith('video')) {
          this.uploadingFiles.push({ ...file, model: 'Media::Video' });
        } else if (this.photoSharingTypes.includes(this.object.model) && file.content_type.startsWith('image')) {
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
          // this.openSelectedModal();
        },
        class: 'btn btn-default',
        liclass: 'hidden-xs',
        tooltip: this.object.object_type === 'Media::Album' ? this.tooltip.addPhotos : this.tooltip.addVideos,
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
        permission: mediaConstants.SHARING_PERMISSIONS.EDIT,
        inDropDown: true, // Inside dropdown list
        action: () => {
          // this.openSelectedModal();
        },
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
          // this.editName(this.object)
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
        action: this.deleteParent.bind(this),
        class: '',
        liclass: 'visible-xs-block',
        title: 'Delete',
        tooltip: this.tooltip.info,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-trash'
      }
    };
  }
}
