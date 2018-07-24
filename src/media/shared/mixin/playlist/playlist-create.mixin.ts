import { MediaCreateModalService } from "@shared/shared/components/photo/modal/media/media-create-modal.service";
import { ApiBaseService } from "@shared/services";
import { Router } from "@angular/router";

/* PlaylistCreateMixin This is playlist create methods, to
custom method please overwirte any method*/
export class PlaylistCreateMixin {
  subCreatePlaylist: any;
  constructor(public mediaCreateModalService: MediaCreateModalService,
    public apiBaseService: ApiBaseService,
    public router: Router) {}
  openCreatePlaylistModal(selectedObjects: any) {
    this.mediaCreateModalService.open.next({ selectedObjects: selectedObjects, title: 'Create Playlist', namePlaceholder: 'Untitled Plyalist' });
    this.subCreatePlaylist = this.mediaCreateModalService.onCreate$.take(1).subscribe(e => {
      this.onDonePlaylist(e);
      this.mediaCreateModalService.close.next();
    });
  }

  onDonePlaylist(e: any) {
    this.apiBaseService.post(`media/playlists`, { name: e.parents[0].name, description: e.parents[0].description, photos: e.children.map(el => el.id) }).subscribe(res => {
      this.router.navigate(['playlists', res.data.uuid]);
    });
  }
}
