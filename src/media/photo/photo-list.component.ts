import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Mixins } from '@shared/design-patterns/decorator/mixin-decorator';
import { AlbumAddMixin } from '@shared/mixin/album/album-add.mixin';
import { AlbumCreateMixin } from '@shared/mixin/album/album-create.mixin';
import { MediaBasicListMixin } from '@shared/mixin/media-basic-list.mixin';
import { MediaDownloadMixin } from '@shared/mixin/media-download.mixin';
import { MediaModalMixin } from '@shared/mixin/media-modal.mixin';
import { ApiBaseService, CommonEventService } from '@shared/services';
import { WUploader } from '@shared/services/w-uploader';
import { MediaAddModalService } from '@shared/shared/components/photo/modal/media/media-add-modal.service';
import { MediaCreateModalService } from '@shared/shared/components/photo/modal/media/media-create-modal.service';
import { SharingModalResult } from '@shared/shared/components/photo/modal/sharing/sharing-modal';
import { SharingModalMixin } from '@shared/shared/components/photo/modal/sharing/sharing-modal.mixin';
import { SharingModalService } from '@shared/shared/components/photo/modal/sharing/sharing-modal.service';
import { ToastsService } from '@shared/shared/components/toast/toast-message.service';
import { Constants } from '@wth/shared/constant';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';
import * as appStore from '../shared/store';
import { Download } from '../shared/store/media/media.actions';

declare var _: any;

@Mixins([SharingModalMixin, MediaBasicListMixin, AlbumAddMixin, AlbumCreateMixin, MediaDownloadMixin, MediaModalMixin])
@Component({
  moduleId: module.id,
  selector: 'me-photo-list',
  templateUrl: 'photo-list.component.html'
})
export class ZMediaPhotoListComponent implements OnInit, OnDestroy,
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
  sorting: any = { sort_name: 'Date', sort: 'desc' };

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
    private commonEventService: CommonEventService,
    public confirmService: WthConfirmService,
    private uploader: WUploader
  ) {
  }

  ngOnInit() {
    this.loadObjects();
    this.sub = this.commonEventService.filter(e => e.channel === 'WUploaderStatus').subscribe((event: any) => {
      this.doListEvent(event);
    });
  }

  loadObjects(opts: any = {}) {
    this.loading = true;
    opts = { ...opts, model: 'Media::Photo' };
    this.sorting = { sort_name: opts.sort_name || 'Date', sort: opts.sort || 'desc' };
    this.apiBaseService.get('media/media', opts).subscribe(res => {
      this.objects = res.data;
      this.links = res.meta.links;
      this.loading = false;
    });
  }

  loadMoreObjects() {
    console.log(this.links);
    if (this.links && this.links.next) {
      this.loading = true;
      this.apiBaseService.get(this.links.next).subscribe(res => {
        this.objects = [...this.objects, ...res.data];
        this.links = res.meta.links;
        this.loading = false;
      });
    }
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

  /* AlbumCreateMixin This is album create methods, to
custom method please overwirte any method*/
  openCreateAlbumModal: (selectedObjects: any) => void;

  onDoneAlbum(e: any) {
    this.apiBaseService.post(`media/albums`, {
      name: e.parents[0].name,
      description: e.parents[0].description,
      photos: e.children.map(el => el.id)
    }).subscribe(res => {
      this.router.navigate(['albums', res.data.uuid]);
    });
  }

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
      case 'sort':
        this.sorting = event.payload.queryParams;
        this.loadObjects(this.sorting);
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


  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  /* MediaListMixin This is media list methods, to
custom method please overwirte any method*/
  selectedObjectsChanged: (e: any) => void;
  toggleFavorite: (input?: any) => void;

  viewDetail(id: any) {
    let data: any = { returnUrl: '/photos', preview: true };
    if (this.selectedObjects && this.selectedObjects.length > 1) data.ids = this.selectedObjects.map(s => s.id).join(',');
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
      });
    });
  }
}
