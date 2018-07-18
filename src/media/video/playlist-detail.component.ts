import { Component, OnDestroy, OnInit, ViewContainerRef, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {
  ApiBaseService,
  CommonEventService,
  PhotoService,
  UserService,
  WthConfirmService
} from '@wth/shared/services';
import { Mixin } from '@shared/design-patterns/decorator/mixin-decorator';
import { MediaBasicListMixin } from '@media/shared/mixin/media-basic-list.mixin';
import { MediaAdditionalListMixin } from '@media/shared/mixin/media-additional-list.mixin';
import { Constants } from '@shared/constant';
import { MediaListDetailMixin } from '@media/shared/mixin/media-list-detail.mixin';
import { Location } from '@angular/common';
import { LoadModalAble } from '@shared/shared/mixins/modal/load-modal-able.mixin';
import { MediaRenameModalComponent } from '@shared/shared/components/photo/modal/media/media-rename-modal.component';
import { SharingModalMixin } from '@shared/shared/components/photo/modal/sharing/sharing-modal.mixin';
import { SharingModalService } from '@shared/shared/components/photo/modal/sharing/sharing-modal.service';
import { ToastsService } from '@shared/shared/components/toast/toast-message.service';
import { SharingCreateParams, SharingModalResult } from '@shared/shared/components/photo/modal/sharing/sharing-modal';
import { PlaylistAddMixin } from '@media/shared/mixin/playlist/playlist-add.mixin';
import { MediaAddModalService } from '@shared/shared/components/photo/modal/media/media-add-modal.service';
import { MediaCreateModalService } from '@shared/shared/components/photo/modal/media/media-create-modal.service';
import { MediaDownloadMixin } from '@media/shared/mixin/media-download.mixin';

@Mixin([MediaBasicListMixin, MediaAdditionalListMixin, MediaListDetailMixin, LoadModalAble, SharingModalMixin, PlaylistAddMixin, MediaDownloadMixin])
@Component({
  selector: 'playlist-detail',
  templateUrl: '../shared/list/list-detail.component.html',
  styleUrls: ['playlist-detail.component.scss']
})
export class ZPlaylistDetailComponent implements OnInit, MediaListDetailMixin, MediaBasicListMixin, MediaAdditionalListMixin, LoadModalAble, SharingModalMixin, PlaylistAddMixin, MediaDownloadMixin {
  objects: any;
  object: any;
  hasSelectedObjects: boolean;
  selectedObjects: any = [];
  favoriteAll: any;
  loading: boolean;
  tooltip: any = Constants.tooltip;
  viewModes: any = { grid: 'grid', list: 'list', timeline: 'timeline' };
  viewMode: any = this.viewModes.grid;
  links: any;
  showDetailsInfo: any;
  // ============
  titleNoData: any = 'There is no videos!';
  subTitleNoData: any = 'Try to upload a new video';
  actionNoData: any = 'Create an video';
  uploadMode: any = 'multiple';
  uploadType: any = 'video/*';
  // ===========
  menuActions: any = {};
  parentMenuActions: any = {};
  subMenuActions: any = {};
  modalIns: any;
  modalRef: any;
  subShareSave: any;
  // ============
  subAddPlaylist: any;
  subOpenCreatePlaylist: any;
  subCreatePlaylist: any;
  // ============
  @ViewChild('modalContainer', { read: ViewContainerRef }) modalContainer: ViewContainerRef;


  constructor(public mediaAddModalService: MediaAddModalService,
    public mediaCreateModalService: MediaCreateModalService,
    public sharingModalService: SharingModalService,
    public toastsService: ToastsService,
    public apiBaseService: ApiBaseService,
    public resolver: ComponentFactoryResolver,
    public confirmService: WthConfirmService,
    public router: Router,
    public route: ActivatedRoute,
    public location: Location) { }

  ngOnInit(){
    this.route.params.subscribe(p => {
      this.parentMenuActions = this.getMenuActions();
      this.subMenuActions = this.getSubMenuActions();
      this.menuActions = this.parentMenuActions;
      this.loadObjects(p.uuid);
      this.loadObject(p.uuid);
    })
  }

  doListEvent(e: any) {
    switch(e.action) {
      case 'viewDetails':
        this.viewDetail();
        break;
      case 'favorite':
        this.toggleFavorite(e.payload);
        break;
    }
  }

  doToolbarEvent(e: any) {
    switch(e.action) {
      case 'uploaded':
        this.apiBaseService.post(`media/playlists/add_to_playlist`, {playlist: {id: this.object.id}, videos: [e.payload]}).subscribe(res => {
          this.loadObjects(this.object.uuid);
        })
      case 'changeView':
        this.changeViewMode(e.payload);
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

  loadObjects(input: any) {
    this.loading = true;
    this.apiBaseService.get(`media/playlists/${input}/videos`).subscribe(res => {
      this.objects = res.data;
      this.links = res.meta.links;
      this.loading = false;
    });
  }

  loadObject(input: any){
    this.apiBaseService.get(`media/playlists/${input}`).subscribe(res => {
      this.object = res.data;
      this.parentMenuActions.favorite.iconClass = res.data.favorite? 'fa fa-star' : 'fa fa-star-o';
    });
  }

  loadMoreObjects(input?: any) {
    /* this method is load objects to display on init */
    throw new Error('should overwrite this method');
  }

  viewDetail(input?: any) {
    this.router.navigate([`videos/`, this.selectedObjects[0].id]);
  }

  doNoData() {
    throw new Error('should overwrite this method');
  }

  back() {
    this.location.back();
  }

  editName(object: any) {
    this.loadModalComponent(MediaRenameModalComponent);
    this.modalIns.open({selectedObject: this.object});
  }

  selectedObjectsChanged(objectsChanged: any) {
    if (this.objects) {
      this.objects.forEach(ob => {
        if (objectsChanged.some(el => el.id == ob.id && (el.object_type == ob.object_type || el.model == ob.model))) {
          ob.selected = true;
        } else {
          ob.selected = false;
        }
      });
      this.selectedObjects = this.objects.filter(v => v.selected == true);
      this.hasSelectedObjects = (this.selectedObjects && this.selectedObjects.length > 0) ? true : false;
      this.menuActions = this.hasSelectedObjects? this.subMenuActions : this.parentMenuActions;
      this.subMenuActions.favorite.iconClass = this.selectedObjects.every(s => s.favorite) ? 'fa fa-star' : 'fa fa-star-o';
    }
  }

  loadModalComponent:(component: any) => void;

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
      this.subMenuActions.favorite.iconClass = this.selectedObjects.every(s => s.favorite) ? 'fa fa-star' : 'fa fa-star-o';
    });
  }

  deSelect() {
    this.objects.forEach(ob => {
      ob.selected = false;
    })
    this.selectedObjects = [];
    this.hasSelectedObjects = false;
  }

  deleteObjects(term: any = 'items') {
    this.confirmService.confirm({
      header: 'Delete',
      acceptLabel: 'Delete',
      message: `Are you sure to delete ${this.selectedObjects.length} ${term}`,
      accept: () => {
        this.loading = true;
        this.apiBaseService.post(`media/media/delete`, { objects: this.selectedObjects }).subscribe(res => {
          this.loadObjects(this.object.uuid);
          this.loading = false;
        })
      }
    })
  }

  changeViewMode(mode: any) {
    this.viewMode = mode;
  }

  toggleFavoriteParent() {
    this.toggleFavorite([this.object]);
    this.object.favorite = !this.object.favorite;
    this.menuActions.favorite.iconClass = this.object.favorite? 'fa fa-star' : 'fa fa-star-o';
  }

  removeFromParent(){
    this.apiBaseService.post(`media/playlists/remove_from_playlist`, {playlist: {id: this.object.id}, videos: this.selectedObjects.map(ob => {return {id: ob.id, model: ob.model}})}).subscribe(res => {
      this.toastsService.success('You removed videos successfully!');
      this.loadObjects(this.object.uuid);
      this.selectedObjects = [];
      this.hasSelectedObjects = false;
    });
  }

  openModalShareParent() {
    this.openModalShare({selectedObjects: [this.object]});
  }

  openModalShare: (input: any) => void;

  onSaveShare(e: any) {
    const objects = this.hasSelectedObjects? this.selectedObjects : [this.object];
    const data: SharingCreateParams = {
      objects: objects.map(s => { return { id: s.id, model: s.model } }),
      recipients: e.sharingRecipients.map(s => { return { role_id: s.role_id, recipient_id: s.user.id } }),
      role_id: e.role.id
    };
    this.apiBaseService.post('media/sharings', data).subscribe(res => {
      this.toastsService.success('You have just create sharing successful');
    });
  }
  onEditShare: (e: SharingModalResult, sharing: any) => void;

  openModalAddToPlaylistCustom() {
    this.openModalAddToPlaylist(this.selectedObjects);
  }

  openModalAddToPlaylist:(selectedObjects: any) => void;

  onAddToPlaylist(e) {
    this.apiBaseService
      .post(`media/playlists/add_to_playlist`, {
        playlist: {id: e.parents[0].id},
        videos: e.children.map(c => {return {id: c.id, model: c.model}})
      })
      .subscribe(res => {
        this.toastsService.success('You just added to Playlist success');
      });
  }

  downloadMediaCustom() {
    if (this.selectedObjects && this.selectedObjects.length > 0) {
      this.downloadMedia(this.selectedObjects);
    }
  }

  downloadMedia:(media: any) => void;

  openCreatePlaylistModal: (selectedObjects: any) => void;

  onDonePlaylist(e: any) {
    console.log('You should overwrite this one', e);
  }

  toggleInfo:() => void;

  getMenuActions() {
    return {
      add: {
        active: true,
        // needPermission: 'view',
        inDropDown: false, // Outside dropdown list
        action: () => {},
        class: 'btn btn-default',
        liclass: 'hidden-xs',
        tooltip: this.tooltip.share,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-plus-square'
      },
      share: {
        active: true,
        // needPermission: 'view',
        inDropDown: false, // Outside dropdown list
        action: this.openModalShareParent.bind(this),
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
        action: () => { },
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
        action: this.toggleFavoriteParent.bind(this),
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
        action: () => { },
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
        action: () => { },
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
        action: () => {console.log('delete');},
        class: 'btn btn-default',
        liclass: 'hidden-xs',
        tooltip: this.tooltip.tag,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-trash'
      },
      edit: {
        active: true,
        // needPermission: 'view',
        inDropDown: true, // Outside dropdown list
        action: () => { },
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
        action: () => { },
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
        action: () => { },
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
        action: () => { },
        class: '',
        liclass: 'visible-xs-block',
        title: 'Delete',
        tooltip: this.tooltip.info,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-trash'
      }
    }
  }

  getSubMenuActions() {
    return {
      share: {
        active: true,
        // needPermission: 'view',
        inDropDown: false, // Outside dropdown list
        action: this.openModalShare.bind(this),
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
        action: () => { },
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
        action: () => { },
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
        action: () => { },
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
        action: this.removeFromParent.bind(this),
        class: 'btn btn-default',
        liclass: 'hidden-xs',
        tooltip: this.tooltip.tag,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-trash'
      },
      edit: {
        active: true,
        // needPermission: 'view',
        inDropDown: true, // Outside dropdown list
        action: this.openModalAddToPlaylistCustom.bind(this),
        class: '',
        liclass: '',
        title: 'Add To Playlist',
        tooltip: this.tooltip.add,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-edit'
      },
      download: {
        active: true,
        // needPermission: 'view',
        inDropDown: true, // Outside dropdown list
        action: this.downloadMediaCustom.bind(this),
        class: '',
        liclass: '',
        title: 'Download',
        tooltip: this.tooltip.info,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-download'
      },
      detail: {
        active: true,
        // needPermission: 'view',
        inDropDown: true, // Outside dropdown list
        action: this.viewDetail.bind(this),
        class: '',
        liclass: '',
        title: 'View Detail',
        tooltip: this.tooltip.info,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-info-circle'
      },
      deleteMobile: {
        active: true,
        // needPermission: 'view',
        inDropDown: true, // Inside dropdown list
        action: () => { },
        class: '',
        liclass: 'visible-xs-block',
        title: 'Delete',
        tooltip: this.tooltip.info,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-trash'
      }
    }
  }
}
