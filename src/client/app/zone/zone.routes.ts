import { Route } from '@angular/router';
import { ZoneComponent } from './index'
import { ZPictureComponent } from "./index";

export const ZoneRoutes: Route[] = [
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
      {path: 'picture/:category/:id', component: ZPictureComponent},
      {path: '', component: ZPictureComponent}
    ]
  }
];



