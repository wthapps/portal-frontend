import { ApiBaseService } from "@shared/services";
import { MediaAddModalService } from "@shared/shared/components/photo/modal/media/media-add-modal.service";
import { ToastsService } from "@shared/shared/components/toast/toast-message.service";
import { MediaCreateModalService } from "@shared/shared/components/photo/modal/media/media-create-modal.service";
import { AlbumCreateMixin } from "@media/shared/mixin/album/album-create.mixin";
import { Mixin } from "@shared/design-patterns/decorator/mixin-decorator";

@Mixin([AlbumCreateMixin])
/* AlbumAddMixin This is album add methods, to
custom method please overwirte any method*/
export class AlbumAddMixin implements AlbumCreateMixin {
  constructor(public apiBaseService: ApiBaseService, public mediaAddModalService: MediaAddModalService, public toastsService: ToastsService, public mediaCreateModalService: MediaCreateModalService) {}
  subAddAlbum: any;
  subOpenCreateAlbum: any;
  subCreateAlbum: any;

  openModalAddToAlbum(selectedObjects: any) {
    if (this.subAddAlbum) this.subAddAlbum.unsubscribe();
    if (this.subOpenCreateAlbum) this.subOpenCreateAlbum.unsubscribe();
    if (this.subCreateAlbum) this.subCreateAlbum.unsubscribe();
    const getParents = this.apiBaseService.get(`media/albums`);
    this.mediaAddModalService.open.next({
      selectedObjects: selectedObjects,
      getParents: getParents,
      title: 'Add To Abum',
      buttonTitle: 'Create New Album',
      unit: 'photo'
    });
    this.subAddAlbum = this.mediaAddModalService.onAdd$.take(1).subscribe(e => {
      this.onAddToAlbum({parents: [e], children: selectedObjects});
    });
    this.subOpenCreateAlbum = this.mediaAddModalService.onOpenCreateNew$
      .take(1)
      .subscribe(e => {
        this.openCreateAlbumModal(selectedObjects);
      });
  }

  onAddToAlbum(e) {
    console.log('You should overwrite this');
  }

  openCreateAlbumModal:(selectedObjects: any) => void;

  onDoneAlbum(e: any) {
    console.log('You should overwrite this one');
  }
}
