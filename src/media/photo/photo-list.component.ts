import {Component, OnInit, ComponentFactoryResolver, OnDestroy, ViewContainerRef, ViewChild} from '@angular/core';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as appStore from '../shared/store';
import {
  GetAll,
  Favorite,
  AddSuccess,
  DeleteMany,
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
    private router: Router,
    public confirmService: WthConfirmService
  ) {}

  ngOnInit() {
    this.loadObjects();
  }

  loadObjects() {
    this.loading = true;
    this.apiBaseService.get('/media/media?type=photo').subscribe(res => {
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
    })
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
      case 'sort':
        this.store.dispatch(new GetAll({ path: this.path, queryParams: { type: this.type, ...event.payload.queryParams } }));
        break;
      case 'addAlbumSuccessful':
        this.store.dispatch(new AddSuccess(event.payload));
        break;
      case 'favourite':
        this.toggleFavorite(event.payload.selectedObjects)
        break;
      case 'viewDetails':
        this.viewDetail([event.payload.selectedObject]);
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
    }
  }

  viewDetails(payload: any, ids = []) {
    const object = payload.selectedObject;
    this.router.navigate([
      `photos`,
      object.uuid, {
        batchQuery: ids.length > 0 ? `${this.currentQuery}&ids=${ids}]` : this.currentQuery,
        mode: 0
      }
    ]);
  }

  ngOnDestroy() {
    // this.sub.unsubscribe();
  }

  /* MediaListMixin This is media list methods, to
custom method please overwirte any method*/
  selectedObjectsChanged:(e: any) => void;
  toggleFavorite: (input?: any) => void;
  viewDetail(selectedObjects?: any) {
    if (selectedObjects.length > 1) {
      this.viewDetails({ selectedObject: selectedObjects[0] }, _.map(selectedObjects, 'id'));
    } else if (selectedObjects.length === 1) {
      this.viewDetails({ selectedObject: selectedObjects[0] });
    } else if (selectedObjects.length === 0) {
      this.viewDetails({ selectedObject: selectedObjects[0] });
    }
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
}
