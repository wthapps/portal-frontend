import { Route } from '@angular/router';
import { ZMediaComponent } from './media.component';

import { ZMediaPhotoListComponent } from './photo/photo-list.component';

import { ZMediaAlbumListComponent } from './album/album-list.component';
import { ZMediaAlbumDetailComponent } from './album/album-detail.component';

import { ZMediaFavoriteListComponent } from './favourites/favourites-list.component';
import { ZMediaSharedWithMeComponent } from './shared-with-me/shared-with-me.component';

export const ZMediaRoutes: Route[] = [
  {
    path: 'media',
    component: ZMediaComponent,
    children: [
      {path: 'album/:id', component: ZMediaAlbumDetailComponent},
      {path: 'album', component: ZMediaAlbumListComponent},
      {path: 'photo', component: ZMediaPhotoListComponent},
      {path: 'favourites', component: ZMediaFavoriteListComponent},
      {path: 'sharedWithMe', component: ZMediaSharedWithMeComponent},
      {path: '', component: ZMediaComponent}
    ]
  }
];
