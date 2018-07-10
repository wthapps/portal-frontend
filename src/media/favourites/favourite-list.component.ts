import {
  Component,
  ComponentFactoryResolver,
  OnDestroy,
  OnInit
} from '@angular/core';

import { Store } from '@ngrx/store';
import { MediaUploaderDataService } from '@media/shared/uploader/media-uploader-data.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Constants } from '@wth/shared/constant';
import * as appStore from '../shared/store';
import {
  GetAll,
  Favorite,
  AddSuccess,
  DeleteMany
} from '../shared/store/media/media.actions';
import { MediaActionHandler } from '@media/shared/media';
import { DeleteManySuccess } from '@media/shared/store/media';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';
import { MediaBasicListMixin } from '@media/shared/mixin/media-basic-list.mixin';
import { Mixin } from '@shared/design-patterns/decorator/mixin-decorator';
import { ApiBaseService } from '@shared/services';
import { SharingModalService } from '@shared/shared/components/photo/modal/sharing/sharing-modal.service';
import { ToastsService } from '@shared/shared/components/toast/toast-message.service';
import { SharingModalMixin } from '@shared/shared/components/photo/modal/sharing/sharing-modal.mixin';

@Mixin([MediaBasicListMixin, SharingModalMixin])
@Component({
  moduleId: module.id,
  selector: 'me-favourite-list',
  templateUrl: '../shared/list/list.component.html'
})
export class ZMediaFavoriteListComponent implements OnInit, MediaBasicListMixin, SharingModalMixin {
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

  constructor(
    public apiBaseService: ApiBaseService,
    private router: Router,
    public sharingModalService: SharingModalService,
    public toastsService: ToastsService,
    public confirmService: WthConfirmService,
    public resolver: ComponentFactoryResolver
  ) {
  }

  ngOnInit() {
    this.loadObjects();
    this.menuActions = this.getMenuActions();
  }

  doListEvent(e: any) {
    console.log(e);
    switch (e.action) {
      case 'viewDetails':
        this.viewDetails(e.payload);
        break;
      case 'favorite':
        this.toggleFavorite(e.payload);
        break;
    }
  }

  doToolbarEvent(e: any) {

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

  openModalShare:() => void;
  onSaveShare:(input?: any) => void;

  /* MediaListMixin This is media list methods, to
  custom method please overwirte any method*/
  selectedObjectsChanged:(objectsChanged: any) => void;
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
      this.objects = this.objects.filter(ob => ob.favorite);
    });
  }
  deleteObjects: (term: any) => void;
  loadObjects() {
    this.apiBaseService.get(`media/favorites`).subscribe(res => {
      this.objects = res.data;
      this.links = res.meta.links;
    });
  }
  viewDetail(uuid: string) {
    // this.router.navigate(['/playlists', uuid]);
  }
  loadMoreObjects(input?: any) {
    /* this method is load objects to display on init */
    throw new Error('should overwrite this method');
  }
  changeViewMode: (mode: any) => void;

  viewDetails(payload: any) {
    switch (payload.selectedObject.model) {
      case 'Media::Playlist' :
      this.router.navigate(['playlists', payload.selectedObject.uuid]);
      break;
      case 'Media::Album' :
      this.router.navigate(['albums', payload.selectedObject.uuid]);
      break;
      case 'Media::Photo' :
      this.router.navigate(['photos', payload.selectedObject.uuid]);
        break;
      case 'Media::Video' :
      this.router.navigate(['videos', payload.selectedObject.id]);
        break;
        default:
        break;
      }
  }

  getMenuActions() {
    return {
      favourite: {
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
        action: this.openModalShare.bind(this),
        class: '',
        liclass: 'visible-xs-block',
        tooltip: this.tooltip.share,
        title: 'Share',
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-share-alt'
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
        action: () => { },
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
        tooltip: this.tooltip.download,
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
        tooltip: this.tooltip.delete,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-trash'
      }
    }
  }
}
