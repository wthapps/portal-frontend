import { MediaCreateModalService } from "@shared/shared/components/photo/modal/media/media-create-modal.service";

/* PlaylistCreateMixin This is playlist create methods, to
custom method please overwirte any method*/
export class PlaylistCreateMixin {
  subCreatePlaylist: any;
  constructor(public mediaCreateModalService: MediaCreateModalService) {}
  openCreatePlaylistModal(selectedObjects: any) {
    this.mediaCreateModalService.open.next({ selectedObjects: selectedObjects, title: 'Create Playlist', namePlaceholder: 'Untitled Plyalist' });
    this.subCreatePlaylist = this.mediaCreateModalService.onCreate$.take(1).subscribe(e => {
      this.onDonePlaylist(e);
      this.mediaCreateModalService.close.next();
    });
  }

  onDonePlaylist(e: any) {
    console.log('You should overwrite this one');
  }
}
