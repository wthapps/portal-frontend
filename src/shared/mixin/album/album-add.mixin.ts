import { ApiBaseService } from '@shared/services';
import { take, takeUntil } from 'rxjs/operators';

import { MediaAddModalService } from '@shared/shared/components/photo/modal/media/media-add-modal.service';
import { ToastsService } from '@shared/shared/components/toast/toast-message.service';
import { MediaCreateModalService } from '@shared/shared/components/photo/modal/media/media-create-modal.service';
import { Mixins  } from '@shared/design-patterns/decorator/mixin-decorator';
import { Router } from '@angular/router';
import { AlbumCreateMixin } from '@shared/mixin/album/album-create.mixin';
import { Subscription, Subject } from 'rxjs';

@Mixins([AlbumCreateMixin])
/* AlbumAddMixin This is album add methods, to
custom method please overwirte any method*/
export class AlbumAddMixin implements AlbumCreateMixin {
  constructor(public apiBaseService: ApiBaseService,
    public mediaAddModalService: MediaAddModalService,
    public toastsService: ToastsService,
    public router: Router,
    public mediaCreateModalService: MediaCreateModalService
  ) {}
  subAddAlbum: Subscription;
  subOpenCreateAlbum: Subscription;
  subCreateAlbum: Subscription;
  destroy$: Subject<any>;

  // openModalAddToAlbum:(selectedObjects: any) => void;
  // onAddToAlbum:(e: any) => void;
  // openCreateAlbumModal:(selectedObjects: any) => void;
  // onDoneAlbum:(e: any) => void;
  // onAddedToAlbum:(data: any) => void;
  openModalAddToAlbum(selectedObjects: any) {
    if (this.subAddAlbum) { this.subAddAlbum.unsubscribe(); }
    if (this.subOpenCreateAlbum) { this.subOpenCreateAlbum.unsubscribe(); }
    if (this.subCreateAlbum) { this.subCreateAlbum.unsubscribe(); }
    const getParents = this.apiBaseService.get(`media/albums`);
    this.mediaAddModalService.open.next({
      selectedObjects: selectedObjects,
      getParents: getParents,
      title: 'Add To Abum',
      buttonTitle: 'Create New Album',
      unit: 'photo'
    });
    this.subAddAlbum = this.mediaAddModalService.onAdd$.pipe(take(1)).pipe(takeUntil(this.destroy$)).subscribe(e => {
      this.onAddToAlbum({parents: [e], children: selectedObjects});
    });
    this.subOpenCreateAlbum = this.mediaAddModalService.onOpenCreateNew$
      .pipe(take(1))
      .pipe(takeUntil(this.destroy$))
      .subscribe(e => {
        this.openCreateAlbumModal(selectedObjects);
      });
  }

  onAddToAlbum(e) {
    this.apiBaseService
      .post(`media/albums/${e.parents[0].id}/photos`, {
        photos: e.children
      })
      .subscribe(res => {
        this.toastsService.success('You just added to Album success');
        this.onAddedToAlbum(res.data);
      });
  }

  onAddedToAlbum(data: any) {}

  openCreateAlbumModal: (selectedObjects: any) => void;

  onDoneAlbum: (e: any) => void;
}

