import { ApiBaseService, WthConfirmService } from "@shared/services";
/* MediaListMixin This is media list methods, to
custom method please overwirte any method*/
export class MediaListMixin {
  objects: any;
  hasSelectedObjects: any;
  selectedObjects: any;
  favoriteAll: any;
  loading: boolean;

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
    }
  }

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
    });
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
};
