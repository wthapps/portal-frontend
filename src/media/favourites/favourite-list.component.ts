import {
  Component,
  ComponentFactoryResolver,
  OnDestroy,
  OnInit
} from '@angular/core';

import { Store } from '@ngrx/store';
import { MediaUploaderDataService } from '@media/shared/uploader/media-uploader-data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription, Subject } from 'rxjs';
import { Constants } from '@wth/shared/constant';
import * as appStore from '../shared/store';
import {
  GetAll,
  Favorite,
  AddSuccess,
  DeleteMany
} from '../shared/store/media/media.actions';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';
import { Mixins } from '@shared/design-patterns/decorator/mixin-decorator';
import { ApiBaseService, CommonEventService } from '@shared/services';
import { ToastsService } from '@shared/shared/components/toast/toast-message.service';
import { mediaConstants } from '@media/shared/config/constants';
import { LocalStorageService } from 'angular-2-local-storage';
import { takeUntil } from 'rxjs/operators';
import { SharingModalMixin } from '@shared/modules/photo/components/modal/sharing/sharing-modal.mixin';
import { SharingModalService } from '@shared/modules/photo/components/modal/sharing/sharing-modal.service';
import { SharingModalResult } from '@shared/modules/photo/components/modal/sharing/sharing-modal';
import { MediaBasicListMixin, MediaAdditionalListMixin, MediaDownloadMixin } from '@shared/modules/photo/mixins';
import Sharing from '@shared/modules/photo/models/sharing.model';

@Mixins([MediaBasicListMixin, SharingModalMixin, MediaAdditionalListMixin, MediaDownloadMixin])
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
  titleNoData: any = 'There are no favorite items!';
  subTitleNoData: any = '"Favorite" photos, videos or albums to easily find them later';
  iconNoData: any = 'fa fa-star';
  sorting: any;
  endLoading: any;
  disableMoreAction: boolean = true;
  title: string = 'Favorites';
  destroy$: any = new Subject();
  filters: any = [{ title: 'Photos', active: true, link: '/favorites/photos', model: 'Media::Photo' }, { title: 'Albums', active: false, link: '/favorites/albums', model: 'Media::Album' }];

  constructor(
    public apiBaseService: ApiBaseService,
    private router: Router,
    private route: ActivatedRoute,
    public sharingModalService: SharingModalService,
    public toastsService: ToastsService,
    public localStorageService: LocalStorageService,
    public confirmService: WthConfirmService,
    public commonEventService: CommonEventService,
    public resolver: ComponentFactoryResolver
  ) {
  }

  ngOnInit() {
    this.menuActions = this.getMenuActions();
    this.viewMode = this.localStorageService.get('media_view_mode') || this.viewModes.grid;
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.selectedObjects = [];
      if (!params.filter || params.filter == 'photos') {
        this.loadObjects({ 'filter[where][object_type]': 'Media::Photo', 'filter[or][object_type]': 'Media::Video' });
        this.filters = this.filters.map(f => {
          if (f.model == 'Media::Photo') {
            f.active = true;
          } else {
            f.active = false;
          }
          return f;
        })
      } else {
        this.loadObjects({ 'filter[where][object_type]': 'Media::Album', 'filter[or][object_type]': 'Common::Sharing' });
        this.filters = this.filters.map(f => {
          if (f.model == 'Media::Album') {
            f.active = true;
          } else {
            f.active = false;
          }
          return f;
        })
      }
    })
  }

  openModalShare: () => void;
  loadingEnd: () => void;
  onSaveShare: (sharing: Sharing) => void;
  onEditShare: (e: SharingModalResult, sharing: any) => void;
  deSelect: () => void;

  /* MediaListMixin This is media list methods, to
  custom method please overwirte any method*/
  selectedObjectsChanged: (objectsChanged?: any) => void;
  deleteObjects(term: any) {
    const sharings_with_me = this.selectedObjects.filter(s => s.model == 'Common::Sharing' && s.role_id < 5);
    const others = this.selectedObjects.filter(s => !(s.model == 'Common::Sharing' && s.role_id < 5));
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
  validateActions: (menuActions: any, role_id: number) => any;
  downloadMedia: (media: any) => void;

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
      this.selectedObjects = [];
    });
  }

  doListEvent(e: any) {
    switch (e.action) {
      case 'viewDetails':
        this.viewDetails(e.payload);
        break;
      case 'filter':
        this.filters.forEach(f => {
          if (f.title == e.data.title) {
            this.router.navigate([f.link]);
          }
          return f;
        })
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
      case 'clickOnItem':
      case 'clickOnCircle':
        this.selectedObjectsChanged();
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
        if (this.selectedObjects && this.selectedObjects.length == 1) {
          this.validateActions(this.menuActions, this.selectedObjects[0].role_id);
        } else {
          // only view when select many
          this.validateActions(this.menuActions, 1);
          this.menuActions.preview.active = false;
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
    this.objects = [];
    this.apiBaseService.get(`media/favorites`, opts).subscribe(res => {
      this.objects = res.data;
      this.links = res.meta.links;
      this.loading = false;
      this.loadingEnd();
    });
  }
  viewDetail(uuid: string) {
    // this.router.navigate(['/playlists', uuid]);
  }
  loadMoreObjects: (input?: any) => void;

  viewDetails(payload: any) {
    switch (payload.selectedObject.model) {
      case 'Media::Playlist':
        this.router.navigate([`/playlists`, payload.selectedObject.uuid], { queryParams: { returnUrls: ['/', '/favorites'] } });
        break;
      case 'Media::Album':
        this.router.navigate([`/albums`, payload.selectedObject.uuid], { queryParams: { returnUrls: ['/', '/favorites/albums'] } });
        break;
      case 'Media::Photo':
      case 'Media::Video':
        const data: any = { returnUrls: '/favorites/photos', preview: true, model: payload.selectedObject.model };
        this.router.navigate(['photos', payload.selectedObject.uuid], { queryParams: data });
        break;
      case 'Common::Sharing':
        this.router.navigate(['shared', payload.selectedObject.uuid]);
        break;
      default:
        break;
    }
  }

  getMenuActions() {
    return {
      preview: {
        active: true,
        permission: mediaConstants.SHARING_PERMISSIONS.VIEW,
        inDropDown: false, // Outside dropdown list
        action: () => {
          this.viewDetails({ selectedObject: this.selectedObjects[0] });
        },
        class: 'btn btn-default',
        liclass: '',
        tooltip: this.tooltip.preview,
        tooltipPosition: 'bottom',
        iconClass: 'fa fa-eye'
      },
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
          if (this.selectedObjects[0].model == 'Common::Sharing') {
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
