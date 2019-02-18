import { ApiBaseService, WthConfirmService, CommonEventService } from "@shared/services";
import { Constants } from "@shared/constant";
import { LocalStorageService } from "angular-2-local-storage";
/* MediaListMixin This is media list methods, to
custom method please overwirte any method*/
export class MediaBasicListMixin {
  objects: any;
  links: any;
  hasSelectedObjects: boolean;
  selectedObjects: any = [];
  favoriteAll: any;
  loading: boolean;
  tooltip: any = Constants.tooltip;
  viewModes: any = { grid: 'grid', list: 'list', timeline: 'timeline' };
  viewMode: any = this.viewModes.grid;
  sorting: any = {};
  endLoading: any;
  title: string = 'Photos';

  constructor(public apiBaseService: ApiBaseService,
    public confirmService: WthConfirmService,
    public commonEventService: CommonEventService,
    public localStorageService: LocalStorageService) {}

  loadObjects(input?: any) {
    /* this method is load objects to display on init */
    throw new Error('should overwrite this method');
  }

  loadMoreObjects(input?: any) {
    if(this.links && this.links.next) {
      this.apiBaseService.get(this.links.next).subscribe(res => {
        this.objects = [...this.objects, ...res.data];
        this.links = res.meta.links;
        this.loadingEnd();
      })
    }
  };

  viewDetail(input?: any) {
    /* this method is load detail object */
    throw new Error('should overwrite this method');
  }

  loadingEnd() {
    if (!this.links || (this.links && !this.links.next)) {
      this.endLoading = true;
    } else {
      this.endLoading = false;
    }
  }

  deSelect(){
    this.objects = this.objects.map(ob => {
      ob.selected = false;
      return ob;
    });
    this.selectedObjectsChanged();
  }

  selectedObjectsChanged(objectsChanged: any = this.objects) {
    if (this.objects) {
      this.selectedObjects = this.objects.filter(v => v.selected == true);
      this.hasSelectedObjects = this.selectedObjects.length > 0;
      this.favoriteAll = this.selectedObjects.every(s => s.favorite);
      this.commonEventService.broadcast({
        channel: 'ZMediaSharedLeftMenuComponent',
        action: 'updateSelectedObjects',
        payload: this.selectedObjects
      })
      this.onListChanges({ action: 'selectedObjectsChanged', payload: objectsChanged});
    }
  }

  toggleFavorite(items?: any) {
    let data = this.selectedObjects;
    if (items) data = items;
    this.apiBaseService.post(`media/favorites/toggle`, {
      objects: data
        .map(v => { return { id: v.id, object_type: v.model } })
    }).subscribe(res => {
      this.objects = this.objects.map(ob => {
        let tmp = res.data.filter(d => d.id == ob.id && d.object_type == ob.object_type);
        if (tmp && tmp.length > 0) {
          ob.favorite = tmp[0].favorite;
        }
        return ob;
      })
      this.favoriteAll = this.selectedObjects.every(s => s.favorite);
      this.onListChanges({action: 'favorite', payload: res.data});
    });
  }

  onListChanges(e: any) {
    /* this method is load detail object */
    throw new Error('should overwrite this method');
  }

  deleteObjects(term: any = 'items') {
    let isIgnoreConfirmFile = this.selectedObjects.some(ob => { return ob.model == 'Media::Photo' || ob.model == 'Media::Video'});
    if (isIgnoreConfirmFile) {
      this.loading = true;
      this.objects = this.objects.filter(ob => {
        return !this.selectedObjects.map(s => s.uuid).includes(ob.uuid);
      });
      this.apiBaseService.post(`media/media/delete`, { objects: this.selectedObjects }).subscribe(res => {
        this.loading = false;
        this.hasSelectedObjects = false;
        this.selectedObjects = [];
      })
    } else {
      this.confirmService.confirm({
        header: 'Delete',
        acceptLabel: 'Delete',
        message: `Are you sure to delete ${this.selectedObjects.length} ${term}` + (this.selectedObjects.length > 1 ? 's' : ''),
        accept: () => {
          this.loading = true;
          this.objects = this.objects.filter(ob => {
            return !this.selectedObjects.map(s => s.uuid).includes(ob.uuid);
          });
          this.apiBaseService.post(`media/media/delete`, { objects: this.selectedObjects }).subscribe(res => {
            this.loading = false;
            this.hasSelectedObjects = false;
            this.selectedObjects = [];
          })
        }
      });
    }
  }

  changeViewMode(mode: any) {
    this.localStorageService.set('media_view_mode', mode);
    this.viewMode = mode;
  }
};
