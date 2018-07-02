import {
  Component,
  OnInit,
  ComponentFactoryResolver,
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
import { Mixin } from '@shared/design-patterns/decorator/mixin-decorator';
import { SharingModalMixin } from '@shared/shared/components/photo/modal/sharing/sharing-modal.mixin';
import { MediaBasicListMixin } from '@media/shared/mixin/media-basic-list.mixin';
import { MediaViewMixin } from '@media/shared/mixin/media-view.mixin';

declare var _: any;
@Mixin([SharingModalMixin, MediaBasicListMixin, MediaViewMixin])
@Component({
  selector: 'me-video-list',
  entryComponents: [
    SharingModalV1Component,
    PlaylistCreateModalComponent,
    PlaylistModalComponent
  ],
  templateUrl: 'video-list.component.html'
})
export class ZMediaVideoListComponent implements OnInit, SharingModalMixin, MediaBasicListMixin, MediaViewMixin {
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
  subShareSave: any;
  // MediaViewMixin
  viewModes: any = {
    grid: 'grid',
    list: 'list',
    timeline: 'timeline'
  };
  viewMode: any = this.viewModes.grid;


  constructor(public apiBaseService: ApiBaseService,
    private router: Router,
    private commonEventService: CommonEventService,
    public sharingModalService: SharingModalService,
    public toastsService: ToastsService,
    public confirmService: WthConfirmService,
    private wthConfirmService: WthConfirmService,
    private playlistModalService: PlaylistModalService,
    public resolver: ComponentFactoryResolver) {}

  ngOnInit() {
    this.loadObjects();
  }

  doListEvent(e: any) {
    switch(e.action) {
      case 'uploaded':
        this.loadObjects();
        break;
      case 'viewDetails':
        this.router.navigate(['/videos', e.payload.selectedObject.id]);
        break;
      case 'deleteMedia':
        this.wthConfirmService.confirm({
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
      case 'getMore':
        this.loadMoreObjects();
        break;
    }
  }

  doToolbarEvent(e: any) {
    switch(e.action) {
      case 'changeView':
        this.changeViewMode(e.payload);
        break;
    }
  }

  uploaVideodHandler(files: any) {
    const data = files.map(file => {
      return { file: file.result, name: file.name, type: file.type };
    });
    this.commonEventService.broadcast({ channel: 'MediaUploadDocker', action: 'initVideos', payload: files });
    data.forEach(f => {
      this.apiBaseService.post(`media/videos`, f).subscribe(res => {
        this.commonEventService.broadcast({ channel: 'MediaUploadDocker', action: 'uploaded', payload: { data: res.data, originPhoto: f } });
        this.loadObjects();
      });
    });
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
  onSaveShare: (e: any) => void;
  // ========== SharingModalMixin ==============

  /* MediaListMixin This is media list methods, to
  custom method please overwirte any method*/
  selectedObjectsChanged: (e: any) => void;
  toggleFavorite: () => void;
  deleteObjects: (term: any) => void;
  loadObjects() {
    this.apiBaseService.get(`media/videos`).subscribe(res => {
      this.links = res.meta.links;
      this.objects = res.data;
    });
  }
  viewDetail(id: number) {
    this.router.navigate(['/videos', id]);
  }
  loadMoreObjects(input?: any) {
    if (this.links && this.links.next) {
      this.apiBaseService.get(this.links.next).subscribe(res => {
        this.objects = [...this.objects, ...res.data];
        this.links = res.meta.links;
      })
    }
  }
  // ============= End MediaListMixin ===============
  /* MediaViewMixin This is media view methods, to
custom method please overwirte any method*/
  changeViewMode:(mode: any) => void;
  // ============= End MediaViewMixin ===============

}
