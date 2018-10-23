import {
  Component,
  OnInit,
  ComponentFactoryResolver,
  ViewContainerRef,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';

import { Constants } from '@wth/shared/constant';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';
import { ApiBaseService, CommonEventService } from '@shared/services';
import { SharingModalV1Component } from '@shared/shared/components/photo/modal/sharing/sharing-modal-v1.component';
import { ToastsService } from '@shared/shared/components/toast/toast-message.service';
import { PlaylistModalComponent } from '@shared/shared/components/photo/modal/playlist/playlist-modal.component';
import { PlaylistCreateModalComponent } from '@shared/shared/components/photo/modal/playlist/playlist-create-modal.component';
import { PlaylistModalService } from '@shared/shared/components/photo/modal/playlist/playlist-modal.service';
import { SharingModalService } from '@shared/shared/components/photo/modal/sharing/sharing-modal.service';
import { Mixins  } from '@shared/design-patterns/decorator/mixin-decorator';
import { SharingModalMixin } from '@shared/shared/components/photo/modal/sharing/sharing-modal.mixin';
import { MediaBasicListMixin } from '@shared/mixin/media-basic-list.mixin';
import { MediaViewMixin } from '@shared/mixin/media-view.mixin';
import { LoadModalAble } from '@shared/shared/mixins/modal/load-modal-able.mixin';
import { MediaRenameModalComponent } from '@shared/shared/components/photo/modal/media/media-rename-modal.component';
import { SharingModalResult } from '@shared/shared/components/photo/modal/sharing/sharing-modal';
import { MediaDownloadMixin } from '@shared/mixin/media-download.mixin';
import { WUploader } from '@shared/services/w-uploader';

declare var _: any;
@Mixins([SharingModalMixin, MediaBasicListMixin, MediaViewMixin, LoadModalAble, MediaDownloadMixin])
@Component({
  selector: 'me-video-list',
  entryComponents: [
    SharingModalV1Component,
    PlaylistCreateModalComponent,
    PlaylistModalComponent
  ],
  templateUrl: 'video-list.component.html'
})
export class ZMediaVideoListComponent implements OnInit, SharingModalMixin, MediaBasicListMixin, MediaViewMixin, LoadModalAble, MediaDownloadMixin {
  // display videos on screen
  objects: any;
  // tooltip to introduction
  tooltip: any = Constants.tooltip;
  // MediaListMixin
  hasSelectedObjects: boolean = false;
  selectedObjects: any = [];
  loading: boolean = false;
  favoriteAll: boolean = false;
  links: any = {};
  subAddPlaylist: any;
  // MediaViewMixin
  viewModes: any = {
    grid: 'grid',
    list: 'list',
    timeline: 'timeline'
  };
  viewMode: any = this.viewModes.grid;
  modalIns: any;
  modalRef: any;
  sorting: any;
  endLoading: any;
  @ViewChild('modalContainer', { read: ViewContainerRef }) modalContainer: ViewContainerRef;

  constructor(public apiBaseService: ApiBaseService,
    private router: Router,
    private commonEventService: CommonEventService,
    public sharingModalService: SharingModalService,
    public toastsService: ToastsService,
    public confirmService: WthConfirmService,
    private playlistModalService: PlaylistModalService,
    public resolver: ComponentFactoryResolver,
    private uploader: WUploader
              ) {}

  ngOnInit() {
    this.loadObjects();
  }

  loadModalComponent:(component: any) => void;

  downloadMedia:(media: any) => void;

  doListEvent(e: any) {
    switch(e.action) {
      case 'viewDetails':
        this.viewDetail(e.payload.selectedObject.uuid);
        break;
      case 'deleteMedia':
        this.confirmService.confirm({
          message: 'Are you sure to delete',
          accept: () => {
            let data = this.objects.filter(v => v.selected)
            .map(v => {return {id: v.id, model: v.model}});
            this.apiBaseService.post(`media/videos/delete`, {objects: data}).subscribe(res => {
              this.objects = this.objects.filter(v => !v.selected)
            });
          }
        })
        break;
      case 'objectsChange':
        this.selectedObjectsChanged(e.payload);
        break;
      case 'openModal':
        let options: any;
        if (e.payload.modalName == 'editNameModal') {
          this.loadModalComponent(MediaRenameModalComponent);
          options = { selectedObject: e.payload.selectedObject };
        }
        this.modalIns.open(options);
        this.modalIns.event.subscribe(e => this.doModalAction(e))
        break;
      case 'favorite':
        this.toggleFavorite(e.payload);
        break;
      case 'getMore':
        this.loadMoreObjects();
        break;
      case 'sort':
        this.sorting = e.payload.queryParams;
        this.loadObjects(this.sorting);
        break;
    }
  }

  doModalAction(e: any) {
    switch (e.action) {
      case 'editName' :
        this.apiBaseService.put(`media/videos/${e.params.selectedObject.id}`, e.params.selectedObject).subscribe(res => {
          // console.log(e);
        });
        break;
      default:
        break;
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

  doToolbarEvent(e: any) {
    switch(e.action) {
      case 'changeView':
        this.changeViewMode(e.payload);
        break;
      case 'uploaded':
        this.loadObjects();
        break;
    }
  }

  openModalAddToPlaylist() {
    if (this.subAddPlaylist) this.subAddPlaylist.unsubscribe();
    this.playlistModalService.open.next({ selectedObjects: this.selectedObjects });
    this.subAddPlaylist = this.playlistModalService.onAdd$.take(1).subscribe(e => {
      this.apiBaseService.post(`media/playlists/add_to_playlist`, { playlist: e, videos: this.selectedObjects }).subscribe(res => {
        this.toastsService.success('You just added to Playlist success');
      });
    });
  }
  /* SharingModalMixin This is methods to sharing, to
  custom method to overwirte any method*/
  openModalShare: () => void;
  loadingEnd: () => void;
  onSaveShare: (e: SharingModalResult) => void;
  onEditShare: (e: SharingModalResult, sharing: any) => void;
  // ========== SharingModalMixin ==============

  /* MediaListMixin This is media list methods, to
  custom method please overwirte any method*/
  selectedObjectsChanged: (e: any) => void;
  toggleFavorite: (input?: any) => void;
  deleteObjects: (term: any) => void;
  loadObjects(opts: any = {}) {
    this.loading = true;
    this.sorting = { sort_name: opts.sort_name || "Date", sort: opts.sort || "desc" };
    this.apiBaseService.get(`media/videos`, opts).subscribe(res => {
      this.links = res.meta.links;
      this.objects = res.data;
      this.loading = false;
      this.loadingEnd();
    });
  }

  viewDetail(id: any) {
    // this.router.navigate([`/videos/${id}`, { ids: this.selectedObjects.map(e => e.id)} ]);
    let data: any = { returnUrl: '/videos', preview: true };
    if (this.selectedObjects && this.selectedObjects.length > 1) data.ids = this.selectedObjects.map(s => s.id).join(',')
    this.router.navigate([`/videos/${id}`], { queryParams: data });
  }

  loadMoreObjects:(input?: any) => void;
  // ============= End MediaListMixin ===============
  /* MediaViewMixin This is media view methods, to
custom method please overwirte any method*/
  changeViewMode:(mode: any) => void;
  // ============= End MediaViewMixin ===============

  upload(content_types: any = []) {
    this.uploader.open('FileInput', '.w-uploader-file-input-container', {
      allowedFileTypes: content_types
    });
  }
}
