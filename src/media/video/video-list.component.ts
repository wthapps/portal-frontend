import {
  Component,
  OnInit,
  ComponentFactoryResolver,
  OnDestroy,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { Router, Resolve } from '@angular/router';

import { Constants } from '@wth/shared/constant';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';
import { ApiBaseService, CommonEventService } from '@shared/services';
import { SharingModalV1Component } from '@shared/shared/components/photo/modal/sharing/sharing-modal-v1.component';
import { CreateCommonSharing } from '@shared/shared/components/photo/modal/sharing/sharing-modal';
import { ToastsService } from '@shared/shared/components/toast/toast-message.service';
import { PlaylistModalComponent } from '@shared/shared/components/photo/modal/playlist/playlist-modal.component';
import { PlaylistCreateModalComponent } from '@shared/shared/components/photo/modal/playlist/playlist-create-modal.component';
import { PlaylistModalService } from '@shared/shared/components/photo/modal/playlist/playlist-modal.service';
import { SharingModalV1Service } from '@shared/shared/components/photo/modal/sharing/sharing-modal-v1.service';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'me-video-list',
  entryComponents: [
    SharingModalV1Component,
    PlaylistCreateModalComponent,
    PlaylistModalComponent
  ],
  templateUrl: 'video-list.component.html'
})
export class ZMediaVideoListComponent implements OnInit {
  // display videos on screen
  objects: any;
  // tooltip to introduction
  tooltip: any = Constants.tooltip;
  // check has selected objects
  hasSelectedObjects: boolean = false;
  selectedObjects: any = [];
  favoriteAll: boolean = false;
  links: any = {};
  subAddPlaylist: any;
  subOpenShare: any;

  constructor(private apiBaseService: ApiBaseService,
    private router: Router,
    private commonEventService: CommonEventService,
    private sharingModalService: SharingModalV1Service,
    private toastsService: ToastsService,
    private wthConfirmService: WthConfirmService,
    private playlistModalService: PlaylistModalService,
    public resolver: ComponentFactoryResolver) {}

  ngOnInit() {
    this.load();
  }

  doEvent(e: any) {
    switch(e.action) {
      case 'uploaded':
        this.load();
        break;
      case 'viewDetails':
        this.router.navigate(['/videos', e.payload.selectedObject.id]);
        break;
      case 'preview':
        this.router.navigate(['/videos', e.payload.selectedObject.id]);
        break;
      case 'favourite':
        this.apiBaseService.post(`media/favorites/toggle`, {
          objects: this.selectedObjects
          .map(v => {return {id: v.id, object_type: 'Media::Video'}})}).subscribe(res => {
            this.objects = this.objects.map(v => {
              let tmp = res.data.filter(d => d.id == v.id);
              if (tmp && tmp.length > 0) {
                v.favorite = tmp[0].favorite;
              }
              return v;
            })
            this.favoriteAll = this.selectedObjects.every(s => s.favorite);
        });
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
      case 'getMore':
        if (this.links && this.links.next) {
          this.apiBaseService.get(this.links.next).subscribe(res => {
            this.objects = [...this.objects, ...res.data];
            this.links = res.meta.links;
          })
        }
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
        this.load();
      });
    });
  }

  load() {
    this.apiBaseService.get(`media/videos`).subscribe(res => {
      this.links = res.meta.links;
      this.objects = res.data;
    });
  }

  selectedObjectsChanged(e: any) {
    this.hasSelectedObjects = true;
    if(e && e.length == 0) this.hasSelectedObjects = false;
    this.objects = this.objects.map(v => {
      if(e.some(ob => ob.id == v.id)) {
        v.selected = true;
      } else {
        v.selected = false;
      }
      return v;
    })
    this.selectedObjects = this.objects.filter(v => v.selected == true);
    this.favoriteAll = this.selectedObjects.every(s => s.favorite);
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

  openModalShare(){
    if (this.subOpenShare) this.subOpenShare.unsubscribe();
    this.sharingModalService.open.next();
    this.subOpenShare = this.sharingModalService.onSave$.take(1).subscribe(e => {
      const data: SharingCreateParams = {
        recipients: e.selectedContacts.map(c => { return { id: c.id } }),
        objects: this.selectedObjects.map(ob => { return { id: ob.id, model: ob.model } }),
        role_id: e.role.id
      };
      this.apiBaseService.post('media/sharings', data).subscribe(res => {
        this.toastsService.success('You have just created sharing successful');
      })
    })
  }
}

interface SharingCreateParams {
  objects: Array<{id, model}>[];
  recipients: Array<{id}>[];
  role_id: number;
}
