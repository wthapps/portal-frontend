import { MediaCreateModalService } from "@shared/shared/components/photo/modal/media/media-create-modal.service";

/* AlbumCreateMixin This is album create methods, to
custom method please overwirte any method*/
export class AlbumCreateMixin {
  subCreateAlbum: any;
  constructor(public mediaCreateModalService: MediaCreateModalService) {}
  openCreateAlbumModal(selectedObjects: any) {
    this.mediaCreateModalService.open.next({ selectedObjects: selectedObjects, title: 'Create Album', namePlaceholder: 'Untitled Album' });
    this.subCreateAlbum = this.mediaCreateModalService.onCreate$.take(1).subscribe(e => {
      this.onDoneAlbum(e);
      this.mediaCreateModalService.close.next();
    });
  }

  onDoneAlbum(e: any) {
    console.log('You should overwrite this one');
  }
}
