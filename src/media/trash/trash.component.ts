import { Component, OnInit, ComponentFactoryResolver, OnDestroy, ViewContainerRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as appStore from '../shared/store';
import {
  Download
} from '../shared/store/media/media.actions';
import { Constants } from '@wth/shared/constant';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';
import { SharingModalMixin } from '@shared/shared/components/photo/modal/sharing/sharing-modal.mixin';
import { Mixins } from '@shared/design-patterns/decorator/mixin-decorator';
import { SharingModalService } from '@shared/shared/components/photo/modal/sharing/sharing-modal.service';
import { ApiBaseService, CommonEventService } from '@shared/services';
import { ToastsService } from '@shared/shared/components/toast/toast-message.service';
import { MediaBasicListMixin } from '@shared/mixin/media-basic-list.mixin';
import { MediaAddModalService } from '@shared/shared/components/photo/modal/media/media-add-modal.service';
import { MediaCreateModalService } from '@shared/shared/components/photo/modal/media/media-create-modal.service';
import { AlbumAddMixin } from '@shared/mixin/album/album-add.mixin';
import { AlbumCreateMixin } from '@shared/mixin/album/album-create.mixin';
import { MediaDownloadMixin } from '@shared/mixin/media-download.mixin';
import { MediaModalMixin } from '@shared/mixin/media-modal.mixin';
import { SharingModalResult } from '@shared/shared/components/photo/modal/sharing/sharing-modal';
import { WUploader } from '@shared/services/w-uploader';
import { Subject } from 'rxjs';
import { LocalStorageService } from 'angular-2-local-storage';
import { takeUntil } from 'rxjs/operators';

declare var _: any;
@Mixins([SharingModalMixin, MediaBasicListMixin, AlbumAddMixin, AlbumCreateMixin, MediaDownloadMixin, MediaModalMixin])
@Component({
  moduleId: module.id,
  selector: 'me-trash',
  templateUrl: 'trash.component.html'
})
export class ZMediaTrashComponent implements OnInit, OnDestroy,
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
  objects: any;
  links: any;
  selectedObjects: any = [];
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
  sorting: any = { sort_name: "Date", sort: "desc" };
  destroy$ = new Subject();
  title: string = 'Trash';
  filters: any = [{ title: 'Photos', active: true, model: 'Media::Photo' }, { title: 'Albums', active: false, model: 'Media::Album' }];

  private sub: any;

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
    public route: ActivatedRoute,
    public localStorageService: LocalStorageService,
    public commonEventService: CommonEventService,
    public confirmService: WthConfirmService,
    private uploader: WUploader
  ) { }

  deSelect: () => void;

  ngOnInit() {
    this.viewMode = this.localStorageService.get('media_view_mode') || this.viewModes.grid;
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      if (!params.model || params.model == 'Media::Photo') {
        this.loadObjects({ 'filter[where][object_type]': 'Media::Photo', 'filter[or][object_type]': 'Media::Video' });
        this.filters = this.filters.map(f => {
          if (f.model == 'Media::Photo') {
            f.active = true;
          } else {
            f.active = false;
          }
          return f;
        })
      } else {
        this.loadObjects({ 'filter[where][object_type]': 'Media::Album' });
        this.filters = this.filters.map(f => {
          if (f.model == 'Media::Album') {
            f.active = true;
          } else {
            f.active = false;
          }
          return f;
        })
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadObjects(opts: any = {}) {
    this.loading = true;
    opts = { ...opts, model: 'Media::Trash' };
    this.sorting = { sort_name: opts.sort_name || "Date", sort: opts.sort || "desc" };
    this.apiBaseService.get('media/trashes', opts).subscribe(res => {
      this.objects = res.data;
      this.links = res.meta.links;
      this.loading = false;
      this.loadingEnd();
    });
  }

  restore() {
    this.apiBaseService.post(`media/trashes/restore`, { objects: this.selectedObjects.map(e => { return { id: e.id, model: e.model } }) }).subscribe(res => {
      this.loadObjects();
    })
  }

  delete() {
    this.confirmService.confirm({
      header: 'Delete',
      acceptLabel: 'Delete',
      message: `Selected photos or videos in your Trash will be deleted permanently. This action can't be undone`,
      accept: () => {
        this.objects = this.objects.filter(ob => {
          return !this.selectedObjects.some(s => {
            return (s.id == ob.id && s.model == ob.model)
          })
        })
        this.apiBaseService.post(`media/trashes/really_destroy`, { objects: this.selectedObjects.map(e => { return { id: e.id, model: e.model } }) }).subscribe(res => {
          // this.loadObjects();
        })
      }
    })
  }

  emptyTrash() {
    this.confirmService.confirm({
      header: 'Empty Trash',
      acceptLabel: 'Delete',
      message: `All photos and videos in your Trash will be deleted permanently. This action can't be undone`,
      accept: () => {
        let tmp = this.objects;
        this.objects = [];
        this.apiBaseService.post(`media/trashes/really_destroy`).subscribe(res => {
        })
      }
    })
  }

  loadMoreObjects: () => void;

  loadingEnd: () => void;

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

  /* AlbumCreateMixin This is album create methods, to
custom method please overwirte any method*/
  openCreateAlbumModal: (selectedObjects: any) => void;
  onDoneAlbum: (e: any) => void;
  /* ================================== */

  /* AlbumAddMixin This is album add methods, to
custom method please overwirte any method*/
  openModalAddToAlbum: (selectedObjects: any) => void;
  onAddToAlbum(e: any) {
    this.apiBaseService
      .post(`media/albums/${e.parents[0].id}/photos`, {
        photos: this.selectedObjects
      })
      .subscribe(res => {
        this.toastsService.success('You just added to Album success');
      });
  }
  onAddedToAlbum: (data: any) => void;
  /* ================================== */

  doListEvent(event: any) {
    switch (event.action) {
      case 'favorite':
        this.toggleFavorite(event.payload)
        break;
      case 'filter':
        this.filters.forEach(f => {
          if (f.title == event.data.title) {
            this.router.navigate(['/trash'], { queryParams: { model: f.model } });
          }
          return f;
        })
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
      case 'sort':
        this.sorting = event.payload.queryParams;
        this.loadObjects(this.sorting);
        break;
      case 'emptyTrash':
        this.emptyTrash();
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
        // this.menuActions.favorite.iconClass = this.favoriteAll ? 'fa fa-star' : 'fa fa-star-o';
        break;
      case 'selectedObjectsChanged':
        // this.menuActions.favorite.iconClass = this.favoriteAll ? 'fa fa-star' : 'fa fa-star-o';
        break;
      default:
        break;
    }
  }

  /* MediaListMixin This is media list methods, to
custom method please overwirte any method*/
  selectedObjectsChanged: (objectsChanged?: any) => void;
  toggleFavorite: (input?: any) => void;
  viewDetail(id: any) {
    let data: any = { returnUrls: '/photos', preview: true };
    if (this.selectedObjects && this.selectedObjects.length > 1) data.ids = this.selectedObjects.map(s => s.id).join(',')
    this.router.navigate([`/photos/${id}`], { queryParams: data });
  }

  // ============= MediaListMixin ===============

  /* SharingModalMixin This is methods to sharing, to
custom method please overwirte any method*/
  openModalShare: () => void;
  onSaveShare: (e: any) => void;
  onEditShare: (e: SharingModalResult, sharing: any) => void;
  deleteObjects: (term: any) => void;
  // ========== SharingModalMixin ==============

  /* MediaViewMixin This is media view methods, to
custom method please overwirte any method*/
  // changeViewMode:(mode: any) => void;
  changeViewMode: (mode: any) => void;
  /* MediaSortMixin This is media sort methods, to
custom method please overwirte any method*/
  sortMedia: () => void;

  downloadMedia: (media: any) => void;

  loadModalComponent: (component: any) => void;

  openEditModal: (object: any) => void;
  onAfterEditModal() {
    /* this method is load objects to display on init */
    const sub = this.modalIns.event.subscribe(event => {
      this.apiBaseService.put(`media/photos/${event.params.selectedObject.id}`, event.params.selectedObject).subscribe(res => {
        if (sub) sub.unsubscribe();
      })
    });
  }
}
