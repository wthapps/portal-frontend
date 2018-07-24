import { MediaCreateModalService } from "@shared/shared/components/photo/modal/media/media-create-modal.service";
import { ApiBaseService } from "@shared/services";
import { Router } from "@angular/router";

/* AlbumCreateMixin This is album create methods, to
custom method please overwirte any method*/
export class AlbumCreateMixin {
  subCreateAlbum: any;
  constructor(
    public mediaCreateModalService: MediaCreateModalService,
    public router: Router,
    public apiBaseService: ApiBaseService) {}
  openCreateAlbumModal(selectedObjects: any) {
    this.mediaCreateModalService.open.next({ selectedObjects: selectedObjects, title: 'Create Album', namePlaceholder: 'Untitled Album' });
    this.subCreateAlbum = this.mediaCreateModalService.onCreate$.take(1).subscribe(e => {
      this.onDoneAlbum(e);
      this.mediaCreateModalService.close.next();
    });
  }

  onDoneAlbum(e: any) {
    this.apiBaseService.post(`media/albums`, { name: e.parents[0].name, description: e.parents[0].description, photos: e.children.map(el => el.id) }).subscribe(res => {
      this.router.navigate(['albums', res.data.uuid]);
    });
  }
}
