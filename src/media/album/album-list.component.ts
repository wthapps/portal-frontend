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
import { MediaUploaderDataService } from '@media/shared/uploader/media-uploader-data.service';
import { Constants } from '@wth/shared/constant';
import { MediaActionHandler } from '@media/shared/media';
import { AlbumService } from '@media/shared/service';
import { MediaBasicListMixin } from '@media/shared/mixin/media-basic-list.mixin';
import { ApiBaseService, WthConfirmService } from '@shared/services';
import { Mixin } from '@shared/design-patterns/decorator/mixin-decorator';
import { MediaViewMixin } from '@media/shared/mixin/media-view.mixin';
import { SharingModalMixin } from '@shared/shared/components/photo/modal/sharing/sharing-modal.mixin';
import { SharingModalService } from '@shared/shared/components/photo/modal/sharing/sharing-modal.service';
import { ToastsService } from '@shared/shared/components/toast/toast-message.service';
import { MediaCreateModalService } from '@shared/shared/components/photo/modal/media/media-create-modal.service';
import { MediaModalMixin } from '@media/shared/mixin/media-modal.mixin';
import { MediaDownloadMixin } from '@media/shared/mixin/media-download.mixin';

@Mixin([MediaBasicListMixin, MediaViewMixin, SharingModalMixin, MediaModalMixin, MediaDownloadMixin])
@Component({
  selector: 'z-media-album-list',
  templateUrl: 'album-list.component.html'
})
export class AlbumListComponent implements OnInit, OnDestroy, MediaBasicListMixin, MediaViewMixin, SharingModalMixin, MediaModalMixin, MediaDownloadMixin {
  objects: any;
  loading: boolean;
  links: any;
  tooltip: any = Constants.tooltip;
  hasSelectedObjects: boolean;
  favoriteAll: boolean;
  selectedObjects: any = [];
  viewModes: any = { grid: 'grid', list: 'list', timeline: 'timeline' };
  viewMode: any = this.viewModes.grid;
  subShareSave: any;
  modalIns: any;
  modalRef: any;
  @ViewChild('modalContainer', { read: ViewContainerRef }) modalContainer: ViewContainerRef;


  constructor(
    protected store: Store<appStore.State>,
    public resolver: ComponentFactoryResolver,
    public apiBaseService: ApiBaseService,
    public confirmService: WthConfirmService,
    public sharingModalService: SharingModalService,
    public mediaCreateModalService: MediaCreateModalService,
    public toastsService: ToastsService,
    private router: Router,
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
    this.apiBaseService.get('/media/media?type=album').subscribe(res => {
      this.objects = res.data;
      this.links = res.meta.links;
      this.loading = false;
    });
  }

  loadMoreObjects(input?: any) {
    this.loading = true;
    this.apiBaseService.get('/media/media?type=album').subscribe(res => {
      this.objects = res.data;
      this.links = res.meta.links;
      this.loading = false;
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
        // this.store.dispatch(new GetAll({path: this.path, queryParams: {type: this.type, ...event.payload.queryParams}}));
        break;
      case 'viewDetails':
        this.viewDetail(event.payload.selectedObject)
        break;
    }
  }

  downloadAlbum() {
    this.apiBaseService.get(`media/media?type=photo&album=${this.selectedObjects[0].id}`).subscribe(res => {
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

  loadModalComponent: (component: any) => void;

  openEditModal:(object: any) => void;
}
