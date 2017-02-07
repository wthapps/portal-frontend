import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ZMediaComponent } from './media.component';

import { ZMediaPhotoListComponent } from './photo/photo-list.component';
import { ZMediaAlbumDetailComponent } from './album/album-detail.component';
import { ZMediaAlbumListComponent } from './album/album-list.component';
import { ZMediaFavoriteDetailComponent } from './favourites/favourites-detail.component';
import { ZMediaFavoriteListComponent } from './favourites/favourites-list.component';
import { ZMediaSharedWithMeComponent } from './shared-with-me/shared-with-me.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'media',
        component: ZMediaComponent,
        children: [
          {path: 'favourites/:category', component: ZMediaFavoriteDetailComponent},
          {path: 'favourites', component: ZMediaFavoriteListComponent},
          {path: 'sharedWithMe', component: ZMediaSharedWithMeComponent},
          {path: 'album/:id', component: ZMediaAlbumDetailComponent},
          {path: 'album', component: ZMediaAlbumListComponent},
          {path: 'photo', component: ZMediaPhotoListComponent},
          {path: '', component: ZMediaComponent}
        ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZMediaRoutingModule {
}
