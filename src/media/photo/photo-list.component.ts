import {Component, OnInit, ComponentFactoryResolver, OnDestroy} from '@angular/core';
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
import { MediaUploaderDataService } from '@media/shared/uploader/media-uploader-data.service';
import { Constants } from '@wth/shared/constant';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';
import { MediaActionHandler } from '@media/shared/media';
import { SharingModalMixin } from '@shared/shared/components/photo/modal/sharing/sharing-modal.mixin';
import { Mixin } from '@shared/design-patterns/decorator/mixin-decorator';
import { SharingModalService } from '@shared/shared/components/photo/modal/sharing/sharing-modal.service';
import { ApiBaseService, CommonEventService } from '@shared/services';
import { ToastsService } from '@shared/shared/components/toast/toast-message.service';
import { MediaListMixin } from '@media/shared/mixin/media-list.mixin';
import { MediaAddModalService } from '@shared/shared/components/photo/modal/media/media-add-modal.service';
import { MediaCreateModalService } from '@shared/shared/components/photo/modal/media/media-create-modal.service';
import { MediaViewMixin } from '@media/shared/mixin/media-view.mixin';
import { WObjectListService } from '@shared/components/w-object-list/w-object-list.service';
import { MediaSortMixin } from '@media/shared/mixin/media-sort.mixin';

declare var _: any;
@Mixin([SharingModalMixin, MediaListMixin, MediaViewMixin, MediaSortMixin])
@Component({
  moduleId: module.id,
  selector: 'me-photo-list',
  templateUrl: 'photo-list.component.html'
})
export class ZMediaPhotoListComponent implements OnInit, OnDestroy, SharingModalMixin, MediaListMixin, MediaViewMixin, MediaSortMixin {
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

  constructor(
    public store: Store<appStore.State>,
    public sharingModalService: SharingModalService,
    public apiBaseService: ApiBaseService,
    public toastsService: ToastsService,
    public mediaAddModalService: MediaAddModalService,
    public mediaCreateModalService: MediaCreateModalService,
    protected resolver: ComponentFactoryResolver,
    private mediaUploaderDataService: MediaUploaderDataService,
    private objectListService: WObjectListService,
    private commonEventService: CommonEventService,
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
      // this.objects = [];
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
    }
  }

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
      case 'deleteMedia':
        this.confirmService.confirm({
          header: 'Delete photo',
          acceptLabel: 'Delete',
          message: `Are you sure to delete ${event.payload.selectedObjects.length} photos`,
          accept: () => {
            this.store.dispatch(new DeleteMany(event.payload));
          }
        });
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

  uploadHandler(files: any) {
    const data = files.map(file => {
      return { file: file.result, name: file.name, type: file.type };
    });
    this.commonEventService.broadcast({ channel: 'MediaUploadDocker', action: 'init', payload: files });
    data.forEach(f => {
      if (f.type.includes('video')) {
        this.apiBaseService.post(`media/videos`, f).subscribe(res => {
          this.commonEventService.broadcast({ channel: 'MediaUploadDocker', action: 'uploaded', payload: { data: res.data, originPhoto: f } });
        });
      } else {
        this.apiBaseService.post(`media/photos`, f).subscribe(res => {
          this.commonEventService.broadcast({ channel: 'MediaUploadDocker', action: 'uploaded', payload: { data: res.data, originPhoto: f } });
        });
      }
    });
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

  openModalAddToAlbum() {
    if (this.subAddAlbum) this.subAddAlbum.unsubscribe();
    if (this.subOpenCreateAlbum) this.subCreateAlbum.unsubscribe();
    if (this.subCreateAlbum) this.subCreateAlbum.unsubscribe();
    const getParents = this.apiBaseService.get(`media/albums`);
    this.mediaAddModalService.open.next({ selectedObjects: this.selectedObjects, getParents: getParents, title: 'Add To Abum', buttonTitle: 'Create New Album', unit: 'photo'});
    this.subAddAlbum = this.mediaAddModalService.onAdd$.take(1).subscribe(e => {
      this.apiBaseService.post(`media/playlists/add_to_playlist`, { playlist: e, videos: this.selectedObjects }).subscribe(res => {
        this.toastsService.success('You just added to Album success');
      });
    });
    this.subOpenCreateAlbum = this.mediaAddModalService.onOpenCreateNew$.take(1).subscribe(e => {
      this.mediaCreateModalService.open.next({selectedObjects: this.selectedObjects, title: 'Create Album', namePlaceholder: 'Untitled Album'});
      this.subCreateAlbum = this.mediaCreateModalService.onCreate$.take(1).subscribe(e => {
        console.log(e);
      });
    })
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
  changeViewMode(mode: any) {
    this.objectListService.changeView(mode);
  }
  /* MediaSortMixin This is media sort methods, to
custom method please overwirte any method*/
  sortMedia:() => void;
}
