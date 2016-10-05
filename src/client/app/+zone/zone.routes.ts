import {RouterConfig}       from '@angular/router';

import {
  ZoneComponent,
  ZPictureComponent
  // ZPhotoComponent,
  // ZVideoComponent,
  // ZAlbumComponent,
}                           from './index';


export const ZoneRoutes: RouterConfig = [
  {
    path: 'zone',
    component: ZoneComponent,
    children: [
      {
        path: 'picture', component: ZPictureComponent

        // children: [
        //   {path: 'photo', component: ZPhotoComponent},
        //   {path: 'album', component: ZAlbumComponent},
        //   {path: 'video/:id', component: ZVideoComponent},
        //   {path: 'video', component: ZVideoComponent},
        //   {path: '', component: ZPhotoComponent}
        // ]
      },
      {path: 'picture/:category', component: ZPictureComponent},
      {path: '', component: ZPictureComponent}
    ]
  }
];
