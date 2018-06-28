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
import { PlaylistModalService } from '@shared/shared/components/photo/modal/playlist/playlist-modal.service';
import { SharingModalV1Service } from '@shared/shared/components/photo/modal/sharing/sharing-modal-v1.service';
import { WObjectListService } from '@shared/components/w-object-list/w-object-list.service';
import { Media } from '@shared/shared/models/media.model';
import { Observable } from 'rxjs/Observable';
import { PlaylistListService } from '@media/video/playlist-list.service';
import { ResponseMetaData } from '@shared/shared/models/response-meta-data.model';

declare var _: any;

@Mixin([LoadModalAble])
@Component({
  moduleId: module.id,
  selector: 'me-playlist-list',
  templateUrl: 'playlist-list.component.html'
})
export class ZMediaPlaylistListComponent implements OnInit {
  // display objects on screen
  objects: any;
  // tooltip to introduction
  tooltip: any = Constants.tooltip;

  // check has selected objects
  hasSelectedObjects: boolean = false;
  selectedObjects: any = [];
  favoriteAll: boolean = false;
  links: any;
  subAddPlaylist: any;
  subOpenShare: any;

  @ViewChild('modalContainer', { read: ViewContainerRef })
  modalContainer: ViewContainerRef;
  medias$: Observable<Media[]>;
  mediaParent: Media;
  selectedMedias$: Observable<Media[]>;
  multipleSelection$: Observable<boolean>;

  currentTab: string; // upload, photos, albums, albums_detail, favourites, shared_with_me

  nextLink: string;
  isLoading: boolean;

  constructor(
    private apiBaseService: ApiBaseService,
    private router: Router,
    private playlistCreateModalService: PlaylistCreateModalService,
    private playlistModalService: PlaylistModalService,
    private sharingModalService: SharingModalV1Service,
    private objectListService: WObjectListService,
    private toastsService: ToastsService,
    private wthConfirmService: WthConfirmService,
    private playlistListService: PlaylistListService,
    public resolver: ComponentFactoryResolver
  ) {
    this.medias$ = this.playlistListService.medias$;
  }

  ngOnInit() {
    this.objectListService.selectedObjects$.subscribe(ob => {
      this.selectedObjectsChanged(ob);
    });
    this.load();

    this.getObjects();
  }
  favourites() {
    console.log('testasasfd');

    let objects = this.selectedObjects.map(ob => {
      return { id: ob.id, object_type: ob.model };
    });

    this.playlistListService.favourites(objects).subscribe();
  }

  getObjects() {
    this.playlistListService.getMedias().subscribe();
  }

  doEvent(e: any) {
    // switch(e.action) {
    //   case 'uploaded':
    //     this.load();
    //     break;
    //   case 'viewDetails':
    //     this.router.navigate(['/videos', e.payload.selectedObject.id]);
    //     break;
    //   case 'preview':
    //     this.router.navigate(['/videos', e.payload.selectedObject.id]);
    //     break;
    //   case 'favourite':
    //     let selectedObjects = [];
    //     if (e.payload) {
    //       selectedObjects = e.payload.selectedObjects;
    //     }
    //     if (selectedObjects && selectedObjects.length == 0) {
    //       selectedObjects = this.objects.filter(v => v.selected == true);
    //     }
    //     this.apiBaseService.post(`media/favorites/toggle`, {
    //       objects: selectedObjects
    //       .map(v => {return {id: v.id, object_type: 'Media::Video'}})}).subscribe(res => {
    //         this.objects = this.objects.map(v => {
    //           let tmp = res.data.filter(d => d.id == v.id);
    //           if (tmp && tmp.length > 0) {
    //             v.favorite = tmp[0].favorite;
    //           }
    //           return v;
    //         })
    //         this.favoriteAll = this.selectedObjects.every(s => s.favorite);
    //     });
    //     break;
    //   case 'deleteMedia':
    //     this.wthConfirmService.confirm({
    //       message: 'Are you sure to delete',
    //       accept: () => {
    //         let data = this.objects.filter(v => v.selected)
    //         .map(v => {return {id: v.id, model: v.model}});
    //         this.apiBaseService.post(`media/videos/delete`, {objects: data}).subscribe(res => {
    //           this.objects = this.objects.filter(v => !v.selected);
    //         });
    //       }
    //     })
    //     break;
    //   case 'getMore':
    //     if (this.links && this.links.next) {
    //       this.apiBaseService.get(this.links.next).subscribe(res => {
    //         this.objects = [...this.objects, ...res.data];
    //         this.links = res.meta.links;
    //       })
    //     }
    //     break;
    // }
  }

  preview() {
    this.router.navigate([
      '/playlists',
      this.objects.filter(ob => ob.selected)[0].uuid
    ]);
  }

  load() {
    this.apiBaseService.get(`media/playlists`).subscribe(res => {
      this.objects = res.data;
    });
  }

  openModalAddToPlaylist() {
    if (this.subAddPlaylist) this.subAddPlaylist.unsubscribe();
    this.playlistModalService.open.next({
      selectedObjects: this.selectedObjects
    });
    this.subAddPlaylist = this.playlistModalService.onAdd$
      .take(1)
      .subscribe(e => {
        this.apiBaseService
          .post(`media/playlists/add_to_playlist`, {
            playlist: e,
            videos: this.selectedObjects
          })
          .subscribe(res => {
            this.toastsService.success('You just added to Playlist success');
          });
      });
  }

  openModalShare() {
    if (this.subOpenShare) this.subOpenShare.unsubscribe();
    this.sharingModalService.open.next();
    this.subOpenShare = this.sharingModalService.onSave$
      .take(1)
      .subscribe(e => {
        const data: SharingCreateParams = {
          recipients: e.selectedContacts.map(c => {
            return { id: c.id };
          }),
          objects: this.selectedObjects.map(ob => {
            return { id: ob.id, model: ob.model };
          }),
          role_id: e.role.id
        };
        this.apiBaseService.post('media/sharings', data).subscribe(res => {
          this.toastsService.success(
            'You have just created sharing successful'
          );
        });
      });
  }

  createPlaylist() {
    this.playlistCreateModalService.open.next();
    this.playlistCreateModalService.onCreated$.subscribe(res => {
      this.load();
    });
  }

  favourite() {
    this.apiBaseService
      .post(`media/favorites/toggle`, {
        objects: this.selectedObjects.map(ob => {
          return { id: ob.id, object_type: ob.model };
        })
      })
      .subscribe(res => {
        this.objects = this.objects.map(v => {
          let tmp = res.data.filter(d => d.id == v.id);
          if (tmp && tmp.length > 0) {
            v.favorite = tmp[0].favorite;
          }
          return v;
        });
        this.favoriteAll = this.selectedObjects.every(s => s.favorite);
      });
  }

  selectedObjectsChanged(e: any) {
    this.hasSelectedObjects = true;
    if (e && e.length == 0) this.hasSelectedObjects = false;
    if (this.objects) {
      this.objects = this.objects.map(v => {
        if (e.some(ob => ob.id == v.id)) {
          v.selected = true;
        } else {
          v.selected = false;
        }
        return v;
      });
      this.selectedObjects = this.objects.filter(o => o.selected == true);
      this.favoriteAll = this.selectedObjects.every(s => s.favorite);
    }
  }

  onCompleteDoubleClick(e: any) {
    console.log(e);
  }
}

interface SharingCreateParams {
  objects: Array<{ id; model }>[];
  recipients: Array<{ id }>[];
  role_id: number;
}
