import { Router } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';
import { take } from 'rxjs/operators';

import { MediaCreateModalService } from '@shared/shared/components/photo/modal/media/media-create-modal.service';
import { ApiBaseService } from '@shared/services';

/* AlbumCreateMixin This is album create methods, to
custom method please overwirte any method*/
export class AlbumCreateMixin {
  subCreateAlbum: Subscription;
  constructor(
    public mediaCreateModalService: MediaCreateModalService,
    public router: Router,
    public apiBaseService: ApiBaseService) {}
  openCreateAlbumModal(selectedObjects: any) {
    if (this.subCreateAlbum) { this.subCreateAlbum.unsubscribe(); }
    selectedObjects = selectedObjects.filter(s => s.model === 'Media::Photo');
    this.mediaCreateModalService.open.next({ selectedObjects: selectedObjects, title: 'Create Album', namePlaceholder: 'Untitled Album' });
    this.subCreateAlbum = this.mediaCreateModalService.onCreate$.pipe(take(1)).subscribe(e => {
      console.log('on done album: ', e);
      this.onDoneAlbum(e);
      this.mediaCreateModalService.close.next();
    });
  }

  onDoneAlbum(e: any) {
    this.apiBaseService.post(`media/albums`, { name: e.parents[0].name, description: e.parents[0].description,
       photos: e.children.map(el => el.id) }).toPromise().then(res => {
      this.router.navigate(['albums', res.data.uuid]);
    });
  }
}
