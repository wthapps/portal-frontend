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
  videos: any;
  // tooltip to introduction
  tooltip: any = Constants.tooltip;
  // check has selected objects
  hasSelectedObjects: boolean = false;
  selectedObjects: any = [];
  favoriteAll: boolean = false;

  constructor(private apiBaseService: ApiBaseService,
    private router: Router,
    private commonEventService: CommonEventService,
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
        let selectedObjects = [];
        if (e.payload) {
          selectedObjects = e.payload.selectedObjects;
        }
        if (selectedObjects && selectedObjects.length == 0) {
          selectedObjects = this.videos.filter(v => v.selected == true);
        }
        this.apiBaseService.post(`media/favorites/toggle`, {
          objects: selectedObjects
          .map(v => {return {id: v.id, object_type: 'Media::Video'}})}).subscribe(res => {
            this.videos = this.videos.map(v => {
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
            let data = this.videos.filter(v => v.selected)
            .map(v => {return {id: v.id, model: v.model}});
            this.apiBaseService.post(`media/videos/delete`, {objects: data}).subscribe(res => {
              this.videos = this.videos.filter(v => !v.selected)
            });
          }
        })
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
      this.videos = res.data;
    });
  }

  selectedObjectsChanged(e: any) {
    this.hasSelectedObjects = true;
    if(e && e.length == 0) this.hasSelectedObjects = false;

    this.videos = this.videos.map(v => {
      if(e.some(ob => ob.id == v.id)) {
        v.selected = true;
      } else {
        v.selected = false;
      }

      return v;
    })
    this.selectedObjects = this.videos.filter(v => v.selected == true);
    this.favoriteAll = this.selectedObjects.every(s => s.favorite);
  }

  openModal(e: any) {
    switch(e.action) {
      case 'share':
        // this.loadModalComponent(SharingModalV1Component);
        // this.modalIns.open({isNew: true});
        // this.modalIns.onSave.subscribe(e => {
        //   this.sharingHandler(e);
        // });
        break;
      case 'playlist':
        this.playlistModalService.open.next({selectedObject: this.selectedObjects});
        this.playlistModalService.onAdd$.subscribe(e => {
          this.apiBaseService.post(`media/playlists/add_to_playlist`, { playlist: e, videos: this.selectedObjects }).subscribe(res => {
            // this.modalIns.close();
          });
        });
        break;
    }
  }

  sharingHandler(e: any) {
    const selectedObjects = this.videos.filter(v => v.selected == true).map(v => { return {id: v.id, object_type: 'video'}});
    const recipientIds = e.map(r => r.id);
    const createCommonSharing: CreateCommonSharing = {role_id: 1, objects: selectedObjects, recipients: recipientIds};

    this.apiBaseService.post(`media/sharings`, createCommonSharing).subscribe(res => {
      this.toastsService.success('You have just created sharing successful');
    })
  }
}
