import { Route } from '@angular/router';
import { ZMediaComponent } from './media.component';
import { ZMediaPhotoListComponent } from './photo/photo-list.component';
import { ZMediaAlbumListComponent } from './album/album-list.component';
import { ZMediaFavoriteListComponent } from './favourites/favourites-list.component';

export const ZMediaRoutes: Route[] = [
  {
    path: 'media',
    component: ZMediaComponent,
    children: [
      {path: 'album', component: ZMediaAlbumListComponent},
      {path: 'photo', component: ZMediaPhotoListComponent},
      {path: 'favourites', component: ZMediaFavoriteListComponent},
      {path: '', component: ZMediaComponent}
    ]
  }
];
