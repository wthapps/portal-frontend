import { ApiBaseService, WthConfirmService } from '@shared/services';
import { ConfirmationService } from 'primeng/primeng';
import { Location } from '@angular/common';
/* MediaListDetailMixin for album detail, playlist detaill*/
export class MediaDetailMixin {
  object: any;
  loading: any;
  constructor(public apiBaseService: ApiBaseService, public confirmService: WthConfirmService, public location: Location) {}

  loadObject(input?: any){
    throw new Error('should overwrite this method');
  }

  toggleFavorite(item?: any) {
    let data = this.object;
    if (item) data = item;

    this.apiBaseService
      .post(`media/favorites/toggle`, {
        objects: data.map(v => {
          return { id: v.id, object_type: v.model };
        })
      })
      .subscribe(res => {
        this.onToggleFavorite(res.data);
      });
  }

  onToggleFavorite(input: any) {
    throw new Error('should overwrite this method');
  }

  deleteObject(term: any = 'item') {
    this.confirmService.confirm({
      header: 'Delete',
      acceptLabel: 'Delete',
      message: `Are you sure to delete this ${term}`,
      accept: () => {
        this.loading = true;
        this.apiBaseService.post(`media/media/delete`, { objects: [this.object] }).subscribe(res => {
          this.back();
          this.loading = false;
        })
      }
    })
  }

  back() {
    this.location.back();
  }
}
