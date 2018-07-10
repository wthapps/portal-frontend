import { ApiBaseService, WthConfirmService } from "@shared/services";
import { Constants } from "@shared/constant";
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

  constructor(public apiBaseService: ApiBaseService, public confirmService: WthConfirmService) {}

  loadObjects(input?: any) {
    /* this method is load objects to display on init */
    throw new Error('should overwrite this method');
  }

  loadMoreObjects(input?: any) {
    /* this method is load objects to display on init */
    throw new Error('should overwrite this method');
  }

  viewDetail(input?: any) {
    /* this method is load detail object */
    throw new Error('should overwrite this method');
  }

  selectedObjectsChanged(objectsChanged: any) {
    if (this.objects) {
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
        let tmp = res.data.filter(d => d.id == ob.id);
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
    this.confirmService.confirm({
      header: 'Delete',
      acceptLabel: 'Delete',
      message: `Are you sure to delete ${this.selectedObjects.length} ${term}`,
      accept: () => {
        this.loading = true;
        this.apiBaseService.post(`media/media/delete`, {objects: this.selectedObjects}).subscribe(res => {
          this.loadObjects();
          this.loading = false;
        })
      }
    })
  }

  changeViewMode(mode: any) {
    this.viewMode = mode;
  }
};
