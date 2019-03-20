import { ApiBaseService } from '@shared/services';

import { take, takeUntil } from 'rxjs/operators';

import { ToastsService } from '@shared/shared/components/toast/toast-message.service';
import { Mixins } from '@shared/design-patterns/decorator/mixin-decorator';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { PlaylistCreateMixin } from './playlist-create.mixin';
import { MediaAddModalService } from '../../components/modal/media/media-add-modal.service';
import { MediaCreateModalService } from '../../components/modal/media/media-create-modal.service';

@Mixins([PlaylistCreateMixin])
/* PlaylistAddMixin This is Playlist add methods, to
custom method please overwirte any method*/
export class PlaylistAddMixin implements PlaylistCreateMixin {
  constructor(public apiBaseService: ApiBaseService,
    public mediaAddModalService: MediaAddModalService,
    public toastsService: ToastsService,
    public router: Router,
    public mediaCreateModalService: MediaCreateModalService) { }
  subAddPlaylist: any;
  subOpenCreatePlaylist: any;
  subCreatePlaylist: any;
  destroy$: Subject<any>;

  // openModalAddToPlaylist:(selectedObjects: any) => void;
  // onAddToPlaylist:(e: any) => void;
  // openCreatePlaylistModal:(selectedObjects: any) => void;
  // onDonePlaylist:(e: any) => void;
  // onAddedToPlaylist:(data: any) => void;
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
    this.subAddPlaylist = this.mediaAddModalService.onAdd$.pipe(take(1)).pipe(takeUntil(this.destroy$)).subscribe(e => {
      this.onAddToPlaylist({ parents: [e], children: selectedObjects });
    });
    this.subOpenCreatePlaylist = this.mediaAddModalService.onOpenCreateNew$
      .pipe(take(1))
      .pipe(takeUntil(this.destroy$))
      .subscribe(e => {
        this.openCreatePlaylistModal(selectedObjects);
      });
  }

  onAddToPlaylist(e) {
    this.apiBaseService
      .post(`media/playlists/add_to_playlist`, {
        playlist: { id: e.parents[0].id },
        videos: e.children.map(c => { return { id: c.id, model: c.model || 'Media::Video' } })
      })
      .subscribe(res => {
        this.toastsService.success('You just added to Playlist success');
        this.onAddedToPlaylist(res.data);
      });
  }
  onAddedToPlaylist(data: any) { }

  openCreatePlaylistModal: (selectedObjects: any) => void;

  onDonePlaylist: (e: any) => void;
}
