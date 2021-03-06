import { GoogleAnalyticsService } from './../../shared/services/analytics/google-analytics.service';
import { Component, OnInit, ComponentFactoryResolver, OnDestroy, ViewContainerRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as appStore from '../shared/store';
import {
  Download
} from '../shared/store/media/media.actions';
import { Constants } from '@wth/shared/constant';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';
import { Mixins } from '@shared/design-patterns/decorator/mixin-decorator';
import { ApiBaseService, CommonEventService, CommonEventHandler, CommonEvent } from '@shared/services';
import { ToastsService } from '@shared/shared/components/toast/toast-message.service';
import { WUploader } from '@shared/services/w-uploader';
import { mediaConstants } from '@media/shared/config/constants';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LocalStorageService } from 'angular-2-local-storage';
import { SharingModalMixin } from '@shared/modules/photo/components/modal/sharing/sharing-modal.mixin';
import { SharingModalService } from '@shared/modules/photo/components/modal/sharing/sharing-modal.service';
import { MediaAddModalService } from '@shared/modules/photo/components/modal/media/media-add-modal.service';
import { MediaCreateModalService } from '@shared/modules/photo/components/modal/media/media-create-modal.service';
import { MediaBasicListMixin, AlbumAddMixin, AlbumCreateMixin, MediaDownloadMixin, MediaModalMixin } from '@shared/modules/photo/mixins';
import { SharingModalResult } from '@shared/modules/photo/components/modal/sharing/sharing-modal';
import MediaList from '@shared/modules/photo/models/list-functions/media-list.model';
import Media from '@shared/modules/photo/models/media.model';


declare var _: any;
const MAX_CONCURRENT_FILES = 4;
@Mixins([SharingModalMixin, MediaBasicListMixin, AlbumAddMixin, AlbumCreateMixin, MediaDownloadMixin, MediaModalMixin])
@Component({
  moduleId: module.id,
  selector: 'me-photo-list',
  templateUrl: '../shared/list/list.component.html'
})
export class ZMediaPhotoListComponent extends CommonEventHandler implements OnInit, OnDestroy,
  SharingModalMixin,
  MediaBasicListMixin,
  AlbumAddMixin,
  AlbumCreateMixin,
  MediaDownloadMixin,
  MediaModalMixin {
  currentQuery: string;
  tooltip: any = Constants.tooltip;
  type = 'photo';
  path = 'media/media';
  objects: Array<Media>;
  links: any;
  selectedObjects: Array<Media> = [];
  favoriteAll: any;
  hasSelectedObjects: boolean;
  loading: boolean;
  subAddAlbum: any;
  subOpenCreateAlbum: any;
  subCreateAlbum: any;
  viewModes: any = {
    grid: 'grid',
    list: 'list',
    timeline: 'timeline'
  };
  viewMode: any = this.viewModes.grid;
  modalIns: any;
  modalRef: any;
  endLoading: any;
  menuActions: any;
  sorting: any = { sort_name: 'created_at', sort: 'desc' };
  destroy$ = new Subject();
  channel = 'ZMediaPhotoListComponent';
  title: string = 'Photos';
  filters: any = [];
  // ============
  titleNoData: any = 'There are no items!';
  subTitleNoData: any = 'Drop photos or videos or use "New" button to upload photos and videos.';
  iconNoData: any = 'fa fa-photo';

  @ViewChild('modalContainer', { read: ViewContainerRef }) modalContainer: ViewContainerRef;

  constructor(
    public store: Store<appStore.State>,
    public sharingModalService: SharingModalService,
    public apiBaseService: ApiBaseService,
    public toastsService: ToastsService,
    public mediaAddModalService: MediaAddModalService,
    public mediaCreateModalService: MediaCreateModalService,
    public resolver: ComponentFactoryResolver,
    public router: Router,
    public commonEventService: CommonEventService,
    public confirmService: WthConfirmService,
    public localStorageService: LocalStorageService,
    private googleAnalytics: GoogleAnalyticsService,
    private uploader: WUploader
  ) {
    super(commonEventService);
  }
  deSelect: () => void;

  ngOnInit() {
    this.loadObjects();
    this.commonEventService.filter(e => e.channel === 'WUploaderStatus').pipe(
      takeUntil(this.destroy$)).subscribe((event: any) => {
        this.doListEvent(event);
      });
    this.menuActions = this.getMenuActions();
    this.viewMode = this.localStorageService.get('media_view_mode') || this.viewModes.grid;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  reLoadObjects(event: CommonEvent) {
    this.loadObjects();
  }

  loadObjects(opts: any = {}) {
    this.loading = true;
    this.sorting = { sort_name: opts.sort_name || 'created_at', sort: opts.sort || 'desc' };
    this.objects = [];
    this.apiBaseService.get('media/media/index_combine', opts).subscribe(res => {
      this.objects = MediaList.map(res.data);
      this.links = res.meta.links;
      this.loading = false;
      this.loadingEnd();
    });
  }

  doToolbarEvent(e: any) {
    switch (e.action) {
      case 'changeView':
        this.changeViewMode(e.payload);
        break;
      case 'uploaded':
        this.loadObjects();
        break;
    }
  }


  // tslint:disable-next-line:member-ordering
  loadMoreObjects: (input?: any) => void;

  // tslint:disable-next-line:member-ordering
  loadingEnd: () => void;

  /* AlbumCreateMixin This is album create methods, to
custom method please overwirte any method*/
  // tslint:disable-next-line:member-ordering
  openCreateAlbumModal: (selectedObjects: any) => void;
  onDoneAlbum: (e: any) => void;
  /* ================================== */

  /* AlbumAddMixin This is album add methods, to
custom method please overwirte any method*/
  // tslint:disable-next-line:member-ordering
  openModalAddToAlbum: (selectedObjects: any) => void;
  onAddToAlbum(e: any) {
    this.apiBaseService
      .post(`media/albums/${e.parents[0].id}/photos`, {
        photos: this.selectedObjects
      })
      .toPromise().then(res => {
        this.toastsService.success('You just added to Album success');
      });
  }
  // tslint:disable-next-line:member-ordering
  onAddedToAlbum: (data: any) => void;
  /* ================================== */

  doListEvent(event: any) {
    switch (event.action) {
      case 'favorite':
        this.toggleFavorite(event.payload);
        break;
      case 'viewDetails':
        this.viewDetail(event.payload.selectedObject.uuid);
        break;
      case 'download':
        this.store.dispatch(new Download(event.payload));
        break;
      case 'updateMediaList':
        this.loadObjects();
        break;
      case 'getMore':
        this.loadMoreObjects();
        break;
      case 'openModal':
        if (event.payload.modalName === 'editNameModal') {
          this.openEditModal(event.payload.selectedObject);
        }
        break;
      case 'sort':
        this.sorting = event.payload.queryParams;
        this.loadObjects(this.sorting);
        break;
      case 'clickOnItem':
      case 'clickOnCircle':
        this.selectedObjectsChanged();
        break;
    }
  }

  upload(content_types: any = []) {
    this.uploader.open('FileInput', '.w-uploader-file-input-container', {
      allowedFileTypes: content_types
    });
  }

  onListChanges(e: any) {
    switch (e.action) {
      case 'favorite':
        this.menuActions.favorite.iconClass = this.favoriteAll ? 'fa fa-star' : 'fa fa-star-o';
        break;
      case 'selectedObjectsChanged':
        if (this.selectedObjects.length > 1) {
          this.menuActions.edit.active = false;
        } else {
          this.menuActions.edit.active = true;
        }
        this.menuActions.favorite.iconClass = this.favoriteAll ? 'fa fa-star' : 'fa fa-star-o';
        break;
      default:
        break;
    }
  }

  /* MediaListMixin This is media list methods, to
custom method please overwirte any method*/
  // tslint:disable-next-line:member-ordering
  selectedObjectsChanged: (objectsChanged?: any) => void;
  // tslint:disable-next-line:member-ordering
  toggleFavorite: (input?: any) => void;
  viewDetail(id: any) {
    const model = this.selectedObjects[0].object_type;
    const data: any = { returnUrls: '/photos', preview: true, model: model };
    if (this.selectedObjects && this.selectedObjects.length > 1) { data.objects = this.selectedObjects.map(s => `${s.uuid},${s.object_type}`); }
    this.router.navigate([`/photos/${id}`], { queryParams: data });
  }

  // ============= MediaListMixin ===============

  /* SharingModalMixin This is methods to sharing, to
custom method please overwirte any method*/
  // tslint:disable-next-line:member-ordering
  openModalShare: () => void;
  // tslint:disable-next-line:member-ordering
  onSaveShare: (e: any) => void;
  // tslint:disable-next-line:member-ordering
  onEditShare: (e: SharingModalResult, sharing: any) => void;
  // tslint:disable-next-line:member-ordering
  deleteObjects: (term: any) => void;
  // ========== SharingModalMixin ==============

  /* MediaViewMixin This is media view methods, to
custom method please overwirte any method*/
  // changeViewMode:(mode: any) => void;
  // tslint:disable-next-line:member-ordering
  changeViewMode: (mode: any) => void;
  /* MediaSortMixin This is media sort methods, to
custom method please overwirte any method*/
  // tslint:disable-next-line:member-ordering
  sortMedia: () => void;

  // tslint:disable-next-line:member-ordering
  downloadMedia: (media: any) => void;

  // tslint:disable-next-line:member-ordering
  loadModalComponent: (component: any) => void;

  // tslint:disable-next-line:member-ordering
  openEditModal: (object: any) => void;
  onAfterEditModal() {
    /* this method is load objects to display on init */
    const sub = this.modalIns.event.subscribe(event => {
      this.apiBaseService.put(`media/photos/${event.params.selectedObject.id}`, event.params.selectedObject).subscribe(res => {
        if (sub) { sub.unsubscribe(); }
      });
    });
  }

  getMenuActions() {
    return {
      preview: {
        active: true,
        permission: mediaConstants.SHARING_PERMISSIONS.OWNER,
        inDropDown: false, // Outside dropdown list
        action: () => {
          this.viewDetail(this.selectedObjects[0].uuid);
        },
        class: 'btn btn-default',
        liclass: '',
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
        permission: mediaConstants.SHARING_PERMISSIONS.OWNER,
        inDropDown: false, // Outside dropdown list
        action: this.toggleFavorite.bind(this),
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
          this.deleteObjects('photo');
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
          this.openModalAddToAlbum(this.selectedObjects);
        },
        class: '',
        liclass: '',
        title: 'Add to Album',
        tooltip: this.tooltip.add,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-plus-square'
      },
      edit: {
        active: true,
        permission: mediaConstants.SHARING_PERMISSIONS.OWNER,
        inDropDown: true, // Outside dropdown list
        action: () => {
          this.openEditModal(this.selectedObjects[0]);
        },
        class: '',
        liclass: '',
        title: 'Edit Information',
        tooltip: this.tooltip.edit,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-pencil'
      },
      download: {
        active: true,
        permission: mediaConstants.SHARING_PERMISSIONS.OWNER,
        inDropDown: true, // Outside dropdown list
        action: () => {
          this.downloadMedia(this.selectedObjects);
          this.googleAnalytics.eventEmitter('photos', 'download');
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
        action: () => { this.deleteObjects('photo'); },
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
