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
import { ApiBaseService } from '@shared/services';
import { SharingModalV1Component } from '@shared/shared/components/photo/modal/sharing/sharing-modal-v1.component';
import { CreateCommonSharing } from '@shared/shared/components/photo/modal/sharing/sharing-modal';
import { ToastsService } from '@shared/shared/components/toast/toast-message.service';
import { PlaylistModalComponent } from '@shared/shared/components/photo/modal/playlist/playlist-modal.component';
import { LoadModalAble } from '@shared/shared/mixins/modal/load-modal-able.mixin';
import { Mixin } from '@shared/design-patterns/decorator/mixin-decorator';
import { PlaylistCreateModalComponent } from '@shared/shared/components/photo/modal/playlist/playlist-create-modal.component';
import { PlaylistCreateModalService } from '@shared/shared/components/photo/modal/playlist/playlist-create-modal.service';

declare var _: any;

@Mixin([LoadModalAble])
@Component({
  moduleId: module.id,
  selector: 'me-playlist-list',
  entryComponents: [
    SharingModalV1Component,
    PlaylistCreateModalComponent,
    PlaylistModalComponent
  ],
  templateUrl: 'playlist-list.component.html'
})

export class ZMediaPlaylistListComponent implements OnInit, LoadModalAble {
  // display objects on screen
  objects: any;
  // tooltip to introduction
  tooltip: any = Constants.tooltip;
  // modal component to load
  modalRef: any;
  modalIns: any;
  // check has selected objects
  hasSelectedObjects: boolean = false;
  selectedObjects: any = [];
  favoriteAll: boolean = false;
  links: any;

  @ViewChild('modalContainer', {read: ViewContainerRef}) modalContainer: ViewContainerRef;

  constructor(private apiBaseService: ApiBaseService,
    private router: Router,
    private playlistCreateModalService: PlaylistCreateModalService,
    private toastsService: ToastsService,
    private wthConfirmService: WthConfirmService,
    public resolver: ComponentFactoryResolver) {}

  ngOnInit() {
    this.load();
  }

  loadModalComponent: (component: any) => void;

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
          selectedObjects = this.objects.filter(v => v.selected == true);
        }
        this.apiBaseService.post(`media/favorites/toggle`, {
          objects: selectedObjects
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

  load() {
    this.apiBaseService.get(`media/playlists`).subscribe(res => {
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

  openModal(e: any) {
    switch(e.action) {
      case 'share':
          this.loadModalComponent(SharingModalV1Component);
          this.modalIns.open({isNew: true});
          this.modalIns.onSave.take(1).subscribe(e => {
            // console.log('onSave1');
            // this.sharingHandler(e);
          });
          break;
      case 'playlist':
          // this.loadModalComponent(PlaylistModalComponent);
          // this.modalIns.open();
          // this.modalIns.onSave.take(1).subscribe(e => {
          //   console.log('onSave');

          //   // this.sharingHandler(e);
          // });
          // this.modalIns.onOpenCreate.take(1).subscribe(e => {
          //   this.modalIns.close().then();
          //   this.loadModalComponent(PlaylistCreateModalComponent);
          //   this.modalIns.open();
          // });
          break;
    }
  }

  createPlaylist() {
    this.playlistCreateModalService.open.next();
    this.playlistCreateModalService.onCreated$.subscribe(res => {
      this.load();
    })
  }

  private sharingHandler(e: any) {
    const selectedObjects = this.objects.filter(v => v.selected == true).map(v => { return {id: v.id, object_type: 'video'}});
    const recipientIds = e.map(r => r.id);
    const createCommonSharing: CreateCommonSharing = {role_id: 1, objects: selectedObjects, recipients: recipientIds};

    this.apiBaseService.post(`media/sharings`, createCommonSharing).subscribe(res => {
      this.toastsService.success('You have just created sharing successful');
    })
  }
}
