import { NgModule, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, ApiBaseService } from '@wth/shared/services';
import { ZMediaVideoListComponent } from '@media/video/video-list.component';
import { ZMediaPlaylistListComponent } from '@media/video/playlist-list.component';
import { ZPlaylistDetailComponent } from '@media/video/playlist-detail.component';
import { ZVideoDetailComponent } from '@shared/components/w-media-preview/video-detail.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'videos',
        component: ZMediaVideoListComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'videos/:id',
        component: ZVideoDetailComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'playlists',
        component: ZMediaPlaylistListComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'playlists/:uuid',
        component: ZPlaylistDetailComponent,
        canActivate: [AuthGuard]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZMediaVideoRoutingModule {}
