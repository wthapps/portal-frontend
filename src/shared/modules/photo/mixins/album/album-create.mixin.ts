import { Router } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';
import { take, takeUntil } from 'rxjs/operators';

import { ApiBaseService, CommonEventService } from '@shared/services';
import { MediaCreateModalService } from '../../components/modal/media/media-create-modal.service';

/* AlbumCreateMixin This is album create methods, to
custom method please overwirte any method*/
export class AlbumCreateMixin {
  subCreateAlbum: Subscription;
  // destroy$: any;
  constructor(
    public mediaCreateModalService: MediaCreateModalService,
    public commonEventService: CommonEventService,
    public router: Router,
    public apiBaseService: ApiBaseService) { }
  openCreateAlbumModal(selectedObjects: any) {
    selectedObjects = selectedObjects.filter(s => s.model === 'Media::Photo' || s.model === 'Media::Video');
    this.commonEventService.broadcast({
      channel: 'MediaCreateModalComponent',
      action: 'open',
      payload: {
        selectedObjects: selectedObjects,
        title: 'Create Album',
        namePlaceholder: 'Untitled Album',
        done: (e) => {
          this.onDoneAlbum(e);
        }
      },
    })
  }

  onDoneAlbum(e: any) {
    this.apiBaseService.post(`media/albums`, {
      name: e.parents[0].name, description: e.parents[0].description,
      objects: e.children.map(el => { return { id: el.id, object_type: el.object_type } })
    }).toPromise().then(res => {
      this.router.navigate(['albums', res.data.uuid]);
    });
  }
}
