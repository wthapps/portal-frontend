import {
  Component,
  ComponentFactoryResolver, OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import * as appStore from '../shared/store';
import {
  GetAll,
  Favorite,
  AddSuccess,
  DeleteMany,
  Download
} from '../shared/store/media/media.actions';
import { Constants } from '@wth/shared/constant';
import { MediaBasicListMixin } from '@media/shared/mixin/media-basic-list.mixin';
import { ApiBaseService, WthConfirmService } from '@shared/services';
import { Mixin } from '@shared/design-patterns/decorator/mixin-decorator';
import { SharingModalMixin } from '@shared/shared/components/photo/modal/sharing/sharing-modal.mixin';
import { SharingModalService } from '@shared/shared/components/photo/modal/sharing/sharing-modal.service';
import { ToastsService } from '@shared/shared/components/toast/toast-message.service';
import { MediaCreateModalService } from '@shared/shared/components/photo/modal/media/media-create-modal.service';
import { MediaModalMixin } from '@media/shared/mixin/media-modal.mixin';
import { MediaDownloadMixin } from '@media/shared/mixin/media-download.mixin';
import { SharingModalResult } from '@shared/shared/components/photo/modal/sharing/sharing-modal';
import { AlbumCreateMixin } from '@media/shared/mixin/album/album-create.mixin';

@Mixin([MediaBasicListMixin, SharingModalMixin, MediaModalMixin, MediaDownloadMixin, AlbumCreateMixin])
@Component({
  selector: 'z-media-album-list',
  templateUrl: 'album-list.component.html'
})
export class AlbumListComponent implements OnInit, OnDestroy, MediaBasicListMixin, SharingModalMixin, MediaModalMixin, MediaDownloadMixin, AlbumCreateMixin {
  objects: any;
  loading: boolean;
  links: any;
  tooltip: any = Constants.tooltip;
  hasSelectedObjects: boolean;
  favoriteAll: boolean;
  selectedObjects: any = [];
  viewModes: any = { grid: 'grid', list: 'list', timeline: 'timeline' };
  viewMode: any = this.viewModes.grid;
  modalIns: any;
  modalRef: any;
  subCreateAlbum: any;
  @ViewChild('modalContainer', { read: ViewContainerRef }) modalContainer: ViewContainerRef;


  constructor(
    protected store: Store<appStore.State>,
    public resolver: ComponentFactoryResolver,
    public apiBaseService: ApiBaseService,
    public confirmService: WthConfirmService,
    public sharingModalService: SharingModalService,
    public mediaCreateModalService: MediaCreateModalService,
    public toastsService: ToastsService,
    public router: Router,
  ) {

  }

  ngOnInit() {
    this.loadObjects();
  }

  ngOnDestroy() {
    // this.sub.unsubscribe();
  }

  loadObjects(input?: any) {
    this.loading = true;
    this.apiBaseService.get('/media/albums', {model: 'Media::Album'}).subscribe(res => {
      this.objects = res.data;
      this.links = res.meta.links;
      this.loading = false;
    });
  }

  loadMoreObjects(input?: any) {
    if (this.links && this.links.next) {
      this.apiBaseService.get(this.links.next).subscribe(res => {
        this.objects = [...this.objects, ...res.data];
        this.links = res.meta.links;
      })
    }
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
        // this.store.dispatch(new GetAll({path: this.path, queryParams: {type: this.type, ...event.payload.queryParams}}));
        break;
      case 'viewDetails':
        this.viewDetail(event.payload.selectedObject)
        break;
      case 'favorite':
        this.toggleFavorite(event.payload);
        break;
      case 'openModal':
        if (event.payload.modalName == "editNameModal") {
          this.openEditModal(event.payload.selectedObject)
        };
        if (event.payload.modalName == "createAlbumModal") {
          this.openCreateAlbumModal([]);
        };
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

  downloadAlbum() {
    this.apiBaseService.get(`media/media/${this.selectedObjects[0].uuid}/objects`, {model: 'Media::Album'}).subscribe(res => {
      this.downloadMedia(res.data);
    })
  }

  downloadMedia:(media: any) => void;

  viewDetail(e: any) {
    this.router.navigate(['albums', e.uuid]);
  }

  selectedObjectsChanged:(objectsChanged: any) => void;
  toggleFavorite:(items: any) => void;
  deleteObjects:(items: any) => void;

  changeViewMode:(mode: any) => void;

  openModalShare: (input: any) => void;
  onSaveShare: (input: any) => void;
  onEditShare: (e: SharingModalResult, sharing: any) => void;

  loadModalComponent: (component: any) => void;

  openEditModal:(object: any) => void;
  onAfterEditModal() {
    /* this method is load objects to display on init */
    const sub = this.modalIns.event.subscribe(event => {
      this.apiBaseService.put(`media/albums/${event.params.selectedObject.id}`, event.params.selectedObject).subscribe(res => {
        if (sub) sub.unsubscribe();
      })
    })
  }

  openCreateAlbumModal:(selectedObjects: any) => void;

  onDoneAlbum(e: any) {
    this.apiBaseService.post(`media/albums`, { name: e.parents[0].name, description: e.parents[0].description, photos: e.children.map(el => el.id) }).subscribe(res => {
      this.loadObjects();
    })
  }
}
