import {Component, OnInit, ComponentFactoryResolver, OnDestroy, ViewContainerRef, ViewChild} from '@angular/core';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as appStore from '../shared/store';
import {
  Download
} from '../shared/store/media/media.actions';
import { Constants } from '@wth/shared/constant';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';
import { SharingModalMixin } from '@shared/shared/components/photo/modal/sharing/sharing-modal.mixin';
import { Mixin } from '@shared/design-patterns/decorator/mixin-decorator';
import { SharingModalService } from '@shared/shared/components/photo/modal/sharing/sharing-modal.service';
import { ApiBaseService, CommonEventService } from '@shared/services';
import { ToastsService } from '@shared/shared/components/toast/toast-message.service';
import { MediaBasicListMixin } from '@media/shared/mixin/media-basic-list.mixin';
import { MediaAddModalService } from '@shared/shared/components/photo/modal/media/media-add-modal.service';
import { MediaCreateModalService } from '@shared/shared/components/photo/modal/media/media-create-modal.service';
import { MediaSortMixin } from '@media/shared/mixin/media-sort.mixin';
import { AlbumAddMixin } from '@media/shared/mixin/album/album-add.mixin';
import { AlbumCreateMixin } from '@media/shared/mixin/album/album-create.mixin';
import { MediaDownloadMixin } from '@media/shared/mixin/media-download.mixin';
import { MediaModalMixin } from '@media/shared/mixin/media-modal.mixin';
import { SharingModalResult } from '@shared/shared/components/photo/modal/sharing/sharing-modal';

declare var _: any;
@Mixin([SharingModalMixin, MediaBasicListMixin, MediaSortMixin, AlbumAddMixin, AlbumCreateMixin, MediaDownloadMixin, MediaModalMixin])
@Component({
  moduleId: module.id,
  selector: 'me-photo-list',
  templateUrl: 'photo-list.component.html'
})
export class ZMediaPhotoListComponent implements OnInit, OnDestroy, SharingModalMixin, MediaBasicListMixin, MediaSortMixin, AlbumAddMixin, AlbumCreateMixin, MediaDownloadMixin, MediaModalMixin {
  currentQuery: string;
  tooltip: any = Constants.tooltip;
  type = 'photo';
  path = 'media/media';
  subShareSave: any;
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
    public confirmService: WthConfirmService
  ) {}

  ngOnInit() {
    this.loadObjects();
  }

  loadObjects() {
    this.loading = true;
    this.apiBaseService.get('/media/media', {model: 'Media::Photo'}).subscribe(res => {
      this.objects = res.data;
      this.links = res.meta.links;
      this.loading = false;
      // TODO: don't need scroll
      setTimeout(() => {window.scrollTo(0, 0)}, 200);
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

  /* AlbumCreateMixin This is album create methods, to
custom method please overwirte any method*/
  openCreateAlbumModal: (selectedObjects: any) => void;
  onDoneAlbum(e: any) {
    this.apiBaseService.post(`media/albums`,{name: e.parents[0].name, description: e.parents[0].description, photos: e.children.map(el => el.id)}).subscribe(res => {
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
  /* ================================== */

  doListEvent(event: any) {
    switch (event.action) {
      case 'favorite':
        this.toggleFavorite(event.payload)
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
        if (event.payload.modalName == "editNameModal") {
          this.openEditModal(event.payload.selectedObject)
        };
        break;
    }
  }

  uploadHandler(files: any) {
    const data = files.map(file => {
      return { file: file.result, name: file.name, type: file.type };
    });
    this.commonEventService.broadcast({ channel: 'MediaUploadDocker', action: 'init', payload: files });
    data.forEach(f => {
      this.apiBaseService.post(`media/photos`, f).subscribe(res => {
        this.commonEventService.broadcast({ channel: 'MediaUploadDocker', action: 'uploaded', payload: { data: res.data, originPhoto: f } });
        this.loadObjects();
      });
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
    // this.sub.unsubscribe();
  }

  /* MediaListMixin This is media list methods, to
custom method please overwirte any method*/
  selectedObjectsChanged:(e: any) => void;
  toggleFavorite: (input?: any) => void;
  viewDetail(id: any) {
    let data: any = { returnUrl: '/photos' };
    if (this.selectedObjects && this.selectedObjects.length > 1) data.ids = this.selectedObjects.map(s => s.id).join(',')
    this.router.navigate([`/photos/${id}`], {queryParams: data});
  }

  loadMoreObjects() {
    if (this.links && this.links.next) {
      this.apiBaseService.get(this.links.next).subscribe(res => {
        this.objects = [...this.objects, ...res.data];
        this.links = res.meta.links;
      })
    }
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
  changeViewMode:(mode: any) => void;
  /* MediaSortMixin This is media sort methods, to
custom method please overwirte any method*/
  sortMedia:() => void;

  downloadMedia:(media: any) => void;

  loadModalComponent: (component: any) => void;

  openEditModal:(object: any) => void;
  onAfterEditModal() {
    /* this method is load objects to display on init */
    const sub = this.modalIns.event.subscribe(event => {
      this.apiBaseService.put(`media/photos/${event.params.selectedObject.id}`, event.params.selectedObject).subscribe(res => {
        if(sub) sub.unsubscribe();
      })
    });
  }
}
