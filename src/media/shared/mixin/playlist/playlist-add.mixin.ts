import { ApiBaseService } from "@shared/services";
import { MediaAddModalService } from "@shared/shared/components/photo/modal/media/media-add-modal.service";
import { ToastsService } from "@shared/shared/components/toast/toast-message.service";
import { MediaCreateModalService } from "@shared/shared/components/photo/modal/media/media-create-modal.service";
import { Mixin } from "@shared/design-patterns/decorator/mixin-decorator";
import { PlaylistCreateMixin } from "@media/shared/mixin/playlist/playlist-create.mixin";

@Mixin([PlaylistCreateMixin])
/* PlaylistAddMixin This is Playlist add methods, to
custom method please overwirte any method*/
export class PlaylistAddMixin implements PlaylistCreateMixin {
  constructor(public apiBaseService: ApiBaseService, public mediaAddModalService: MediaAddModalService, public toastsService: ToastsService, public mediaCreateModalService: MediaCreateModalService) {}
  subAddPlaylist: any;
  subOpenCreatePlaylist: any;
  subCreatePlaylist: any;

  openModalAddToPlaylist(selectedObjects: any) {
    if (this.subAddPlaylist) this.subAddPlaylist.unsubscribe();
    if (this.subOpenCreatePlaylist) this.subOpenCreatePlaylist.unsubscribe();
    if (this.subCreatePlaylist) this.subCreatePlaylist.unsubscribe();
    const getParents = this.apiBaseService.get(`media/playlists`);
    this.mediaAddModalService.open.next({
      selectedObjects: selectedObjects,
      getParents: getParents,
      title: 'Add To Playlist',
      buttonTitle: 'Create New Playlist',
      unit: 'photo'
    });
    this.subAddPlaylist = this.mediaAddModalService.onAdd$.take(1).subscribe(e => {
      this.onAddToPlaylist({parents: [e], children: selectedObjects});
    });
    this.subOpenCreatePlaylist = this.mediaAddModalService.onOpenCreateNew$
      .take(1)
      .subscribe(e => {
        this.openCreatePlaylistModal(selectedObjects);
      });
  }

  onAddToPlaylist(e) {
    console.log('You should overwrite this');
  }

  openCreatePlaylistModal:(selectedObjects: any) => void;

  onDonePlaylist(e: any) {
    console.log('You should overwrite this one');
  }
}
