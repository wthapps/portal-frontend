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
import { SharingModalResult } from '@shared/shared/components/photo/modal/sharing/sharing-modal';
import { MediaAdditionalListMixin } from '@media/shared/mixin/media-additional-list.mixin';
import { mediaConstants } from '@media/shared/conig/constants';
import { MediaDownloadMixin } from '@media/shared/mixin/media-download.mixin';

@Mixin([MediaBasicListMixin, SharingModalMixin, MediaAdditionalListMixin, MediaDownloadMixin])
@Component({
  moduleId: module.id,
  selector: 'me-favourite-list',
  templateUrl: '../shared/list/list.component.html'
})
export class ZMediaFavoriteListComponent implements OnInit,
  MediaBasicListMixin,
  SharingModalMixin,
  MediaDownloadMixin,
  MediaAdditionalListMixin {
  // display objects on screen
  objects: any;
  // tooltip to introduction
  tooltip: any = Constants.tooltip;

  // check has selected objects
  hasSelectedObjects = false;
  selectedObjects: any = [];
  favoriteAll = false;
  links: any;
  subAddPlaylist: any;
  subOpenShare: any;
  loading: boolean;
  viewModes: any = { grid: 'grid', list: 'list', timeline: 'timeline' };
  viewMode: any = this.viewModes.grid;
  menuActions: any = {};
  // ============
  titleNoData: any = 'There is no favorites';
  subTitleNoData: any = 'Add star to items to find easier';
  iconNoData: any = 'fa fa-star';
  sorting: any;

  constructor(
    public apiBaseService: ApiBaseService,
    private router: Router,
    public sharingModalService: SharingModalService,
    public toastsService: ToastsService,
    public confirmService: WthConfirmService,
    public resolver: ComponentFactoryResolver
  ) {
  }

  openModalShare: () => void;
  onSaveShare: (e: SharingModalResult) => void;
  onEditShare: (e: SharingModalResult, sharing: any) => void;
  /* MediaListMixin This is media list methods, to
  custom method please overwirte any method*/
  selectedObjectsChanged: (objectsChanged: any) => void;
  deleteObjects (term: any) {
    const sharings_with_me = this.selectedObjects.filter(s => s.object_type == 'sharing' && s.role_id < 5);
    const others = this.selectedObjects.filter(s => !(s.object_type == 'sharing' && s.role_id < 5));
    this.confirmService.confirm({
      header: 'Delete',
      acceptLabel: 'Delete',
      message: `Are you sure to delete ${this.selectedObjects.length} ${term}`,
      accept: () => {
        this.loading = true;
        this.apiBaseService.post(`media/media/delete`, { objects: others }).subscribe(res => {
          this.apiBaseService.post(`media/sharings/delete_sharings_with_me`, { sharings: sharings_with_me }).subscribe(res => {
            this.loadObjects();
            this.loading = false;
            this.hasSelectedObjects = false;
            this.selectedObjects = [];
          });
        })
      }
    });
  };
  changeViewMode: (mode: any) => void;
  validateActions:(menuActions: any, role_id: number) => any;
  downloadMedia:(media: any) => void;

  toggleFavorite(items?: any) {
    let data = this.selectedObjects;
    if (items) {
      data = items;
    }
    this.apiBaseService.post(`media/favorites/toggle`, {
      objects: data
        .map(v => ({ id: v.id, object_type: v.model }))
    }).subscribe(res => {
      this.objects = this.objects.map(v => {
        const tmp = res.data.filter(d => d.id === v.id);
        if (tmp && tmp.length > 0) {
          v.favorite = tmp[0].favorite;
        }
        return v;
      });
      this.favoriteAll = this.selectedObjects.every(s => s.favorite);
      this.objects = this.objects.filter(ob => ob.favorite);
    });
  }

  ngOnInit() {
    this.loadObjects();
    this.menuActions = this.getMenuActions();
  }

  doListEvent(e: any) {
    switch (e.action) {
      case 'viewDetails':
        this.viewDetails(e.payload);
        break;
      case 'favorite':
        this.toggleFavorite(e.payload);
        break;
      case 'sort':
        this.sorting = e.payload.queryParams;
        this.loadObjects(this.sorting);
        break;
    }
  }

  doToolbarEvent(e: any) {
    switch (e.action) {
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
      // console.log(e.payload[0]);

        if(e.payload && e.payload.length == 1) {
          this.validateActions(this.menuActions, e.payload[0].role_id);
        } else {
          // only view when select many
          this.validateActions(this.menuActions, 1);
          // this.menuActions.delete.active = false;
          // this.menuActions.deleteMobile.active = false;
          this.menuActions.download.active = false;
          this.menuActions.share.active = false;
          this.menuActions.shareMobile.active = false;
        }
        break;
      default:
        break;
    }
  }

  loadObjects(opts: any = {}) {
    this.loading = true;
    this.sorting = { sort_name: opts.sort_name || "Date", sort: opts.sort || "desc" };
    this.apiBaseService.get(`media/favorites`, opts).subscribe(res => {
      this.objects = res.data;
      this.links = res.meta.links;
      this.loading = false;

    });
  }
  viewDetail(uuid: string) {
    // this.router.navigate(['/playlists', uuid]);
  }
  loadMoreObjects(input?: any) {
    /* this method is load objects to display on init */
    throw new Error('should overwrite this method');
  }

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
        this.router.navigate(['videos', payload.selectedObject.uuid]);
        break;
      case 'Common::Sharing' :
        this.router.navigate(['shared', payload.selectedObject.uuid]);
        break;
      default:
        break;
      }
  }

  getMenuActions() {
    return {
      favourite: {
        active: true,
        permission: mediaConstants.SHARING_PERMISSIONS.VIEW,
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
        permission: mediaConstants.SHARING_PERMISSIONS.EDIT,
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
      // tag: {
      //   active: true,
      //   // needPermission: 'view',
      //   inDropDown: false, // Outside dropdown list
      //   action: () => { },
      //   class: 'btn btn-default',
      //   liclass: 'hidden-xs',
      //   tooltip: this.tooltip.tag,
      //   tooltipPosition: 'bottom',
      //   iconClass: 'fa fa-tag'
      // },
      delete: {
        active: true,
        permission: mediaConstants.SHARING_PERMISSIONS.VIEW,
        inDropDown: false, // Outside dropdown list
        action: () => {
          this.deleteObjects('items');
        },
        class: 'btn btn-default',
        liclass: 'hidden-xs',
        tooltip: this.tooltip.delete,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-trash'
      },
      // edit: {
      //   active: true,
      //   // needPermission: 'view',
      //   inDropDown: true, // Outside dropdown list
      //   action: () => { },
      //   class: '',
      //   liclass: '',
      //   title: 'Edit Information',
      //   tooltip: this.tooltip.edit,
      //   tooltipPosition: 'bottom',
      //   iconClass: 'fa fa-edit'
      // },
      // detail: {
      //   active: true,
      //   // needPermission: 'view',
      //   inDropDown: true, // Outside dropdown list
      //   action: () => { },
      //   class: '',
      //   liclass: '',
      //   title: 'View Detail',
      //   tooltip: this.tooltip.info,
      //   tooltipPosition: 'bottom',
      //   iconClass: 'fa fa-info-circle'
      // },
      download: {
        active: true,
        permission: mediaConstants.SHARING_PERMISSIONS.DOWNLOAD,
        inDropDown: true, // Outside dropdown list
        action: () => {
          if (this.selectedObjects[0].object_type == 'sharing') {
            this.apiBaseService.get(`media/sharings/${this.selectedObjects[0].uuid}/objects`).subscribe(res => {
              this.downloadMedia(res.data);
            });
          } else {
            this.downloadMedia(this.selectedObjects)
          }
        },
        class: '',
        liclass: '',
        title: 'Download',
        tooltip: this.tooltip.download,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-download'
      },
      deleteMobile: {
        active: true,
        permission: mediaConstants.SHARING_PERMISSIONS.VIEW,
        inDropDown: true, // Inside dropdown list
        action: () => {
          this.deleteObjects('items');
        },
        class: '',
        liclass: 'visible-xs-block',
        title: 'Delete',
        tooltip: this.tooltip.delete,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-trash'
      }
    };
  }
}
