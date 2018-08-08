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
import { ToastsService } from '@shared/shared/components/toast/toast-message.service';
import { Mixin } from '@shared/design-patterns/decorator/mixin-decorator';
import { PlaylistCreateModalService } from '@shared/shared/components/photo/modal/playlist/playlist-create-modal.service';
import { PlaylistModalService } from '@shared/shared/components/photo/modal/playlist/playlist-modal.service';
import { SharingModalService } from '@shared/shared/components/photo/modal/sharing/sharing-modal.service';
import { WObjectListService } from '@shared/components/w-object-list/w-object-list.service';
import { MediaBasicListMixin } from '@media/shared/mixin/media-basic-list.mixin';
import { SharingModalMixin } from '@shared/shared/components/photo/modal/sharing/sharing-modal.mixin';
import { SharingModalResult } from '@shared/shared/components/photo/modal/sharing/sharing-modal';
import { MediaModalMixin } from '@media/shared/mixin/media-modal.mixin';
import { LocationCustomService } from '@media/shared/service/location-custom.service';
import { Node } from '@shared/data-structures/link-list/node';

declare var _: any;

@Mixin([MediaBasicListMixin, SharingModalMixin, MediaModalMixin])
@Component({
  moduleId: module.id,
  selector: 'me-playlist-list',
  templateUrl: '../shared/list/list.component.html'
  // templateUrl: 'playlist-list.component.html'
})
export class ZMediaPlaylistListComponent implements OnInit,
MediaBasicListMixin,
SharingModalMixin,
MediaModalMixin {
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
  loading: boolean;
  viewModes: any = { grid: 'grid', list: 'list', timeline: 'timeline' };
  viewMode: any = this.viewModes.grid;
  menuActions: any = {};
  subShareSave: any;
  modalIns: any;
  modalRef: any;
  @ViewChild('modalContainer', { read: ViewContainerRef }) modalContainer: ViewContainerRef;

  constructor(
    public apiBaseService: ApiBaseService,
    private router: Router,
    private playlistCreateModalService: PlaylistCreateModalService,
    private playlistModalService: PlaylistModalService,
    public sharingModalService: SharingModalService,
    public toastsService: ToastsService,
    public confirmService: WthConfirmService,
    public objectListService: WObjectListService,
    public locationCustomService: LocationCustomService,
    public resolver: ComponentFactoryResolver
  ) {
  }

  ngOnInit() {
    this.loadObjects();
    this.menuActions = this.getMenuActions();
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

  getMenuActions() {
    return {
      share: {
        active: true,
        // needPermission: 'view',
        inDropDown: false, // Outside dropdown list
        action: () => {
          this.openModalShare([this.selectedObjects[0].sharing_object]);
        },
        class: 'btn btn-default',
        liclass: 'hidden-xs',
        tooltip: this.tooltip.share,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-share-alt'
      },
      shareMobile: {
        active: true,
        // needPermission: 'view',
        inDropDown: true, // Inside dropdown list
        action: this.openModalShare.bind(this),
        class: '',
        liclass: 'visible-xs-block',
        tooltip: this.tooltip.share,
        title: 'Share',
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-share-alt'
      },
      favorite: {
        active: true,
        // needPermission: 'view',
        inDropDown: false, // Outside dropdown list
        action: this.toggleFavorite.bind(this),
        class: 'btn btn-default',
        liclass: '',
        tooltip: this.tooltip.addToFavorites,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-star'
      },
      tag: {
        active: true,
        // needPermission: 'view',
        inDropDown: false, // Outside dropdown list
        action: () => {},
        class: 'btn btn-default',
        liclass: 'hidden-xs',
        tooltip: this.tooltip.tag,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-tag'
      },
      tagMobile: {
        active: true,
        // needPermission: 'view',
        inDropDown: true, // Inside dropdown list
        action: () => {},
        class: '',
        liclass: 'visible-xs-block',
        title: 'Tag',
        tooltip: this.tooltip.tag,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-tag'
      },
      delete: {
        active: true,
        // needPermission: 'view',
        inDropDown: false, // Outside dropdown list
        action: () => {},
        class: 'btn btn-default',
        liclass: 'hidden-xs',
        tooltip: this.tooltip.delete,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-trash'
      },
      edit: {
        active: true,
        // needPermission: 'view',
        inDropDown: true, // Outside dropdown list
        action: () => {},
        class: '',
        liclass: '',
        title: 'Edit Information',
        tooltip: this.tooltip.edit,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-edit'
      },
      detail: {
        active: true,
        // needPermission: 'view',
        inDropDown: true, // Outside dropdown list
        action: () => {},
        class: '',
        liclass: '',
        title: 'View Detail',
        tooltip: this.tooltip.info,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-info-circle'
      },
      download: {
        active: true,
        // needPermission: 'view',
        inDropDown: true, // Outside dropdown list
        action: () => {},
        class: '',
        liclass: '',
        title: 'Download',
        tooltip: this.tooltip.info,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-download'
      },
      deleteMobile: {
        active: true,
        // needPermission: 'view',
        inDropDown: true, // Inside dropdown list
        action: () => {},
        class: '',
        liclass: 'visible-xs-block',
        title: 'Delete',
        tooltip: this.tooltip.delete,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-trash'
      }
    }
  }

  doListEvent(event: any) {
    switch (event.action) {
      case 'viewDetails':
        this.viewDetail(event.payload.selectedObject.uuid);
        break;
      case 'favorite':
        this.toggleFavorite(event.payload);
        break;
      case 'openModal':
        if (event.payload.modalName == "editNameModal") {
          this.openEditModal(event.payload.selectedObject)
        };
        break;
    }
  }

  doToolbarEvent(e: any) {

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

  openModalShare:(input?: any) => void;
  onSaveShare:(e: any) => void;
  onEditShare: (e: SharingModalResult, sharing: any) => void;

  createPlaylist() {
    this.playlistCreateModalService.open.next();
    this.playlistCreateModalService.onCreated$.subscribe(res => {
      this.loadObjects();
    });
  }
  /* MediaListMixin This is media list methods, to
  custom method please overwirte any method*/
  selectedObjectsChanged(objectsChanged: any) {
    if(this.objects) {
      this.hasSelectedObjects = (objectsChanged && objectsChanged.length > 0) ? true : false;
      this.objects.forEach(ob => {
        if (objectsChanged.some(el => el.id == ob.id && (el.object_type == ob.object_type || el.model == ob.model))) {
          ob.selected = true;
        } else {
          ob.selected = false;
        }
      });
      this.selectedObjects = this.objects.filter(v => v.selected == true);
      this.favoriteAll = this.selectedObjects.every(s => s.favorite);
    }
    if (this.favoriteAll) {
      this.menuActions.favorite.iconClass = 'fa fa-star';
    } else {
      this.menuActions.favorite.iconClass = 'fa fa-star-o'
    }
  };
  toggleFavorite(items?: any) {
    let data = this.selectedObjects;
    if (items) data = items;

    this.apiBaseService.post(`media/favorites/toggle`, {
      objects: data
        .map(v => { return { id: v.id, object_type: v.model } })
    }).subscribe(res => {
      this.objects = this.objects.map(v => {
        let tmp = res.data.filter(d => d.id == v.id);
        if (tmp && tmp.length > 0) {
          v.favorite = tmp[0].favorite;
        }
        return v;
      })
      this.favoriteAll = this.selectedObjects.every(s => s.favorite);
      if (this.favoriteAll) {
        this.menuActions.favorite.iconClass = 'fa fa-star';
      } else {
        this.menuActions.favorite.iconClass = 'fa fa-star-o'
      }
    });
  }
  deleteObjects: (term: any) => void;
  loadObjects() {
    this.loading = true;
    this.apiBaseService.get(`media/playlists`).subscribe(res => {
      this.objects = res.data;
      this.links = res.meta.links;
      this.loading = false;
    });
  }
  viewDetail(uuid: string) {
    this.locationCustomService.links.push('/playlists');
    this.router.navigate([`/playlists/${uuid}`]);
  }

  loadMoreObjects(input?: any) {
    /* this method is load objects to display on init */
    throw new Error('should overwrite this method');
  }
  changeViewMode:(mode: any) => void;

  loadModalComponent: (component: any) => void;
  openEditModal:(object: any) => void;
  onAfterEditModal() {
    const sub = this.modalIns.event.subscribe(event => {
      this.apiBaseService.put(`media/playlists/${event.params.selectedObject.id}`, event.params.selectedObject).subscribe(res => {
        if (sub) sub.unsubscribe();
      })
    });
  }
}
