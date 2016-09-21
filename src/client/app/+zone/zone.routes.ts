import {RouterConfig}       from '@angular/router';

import {
  ZoneComponent,
  ZPictureComponent,
  ZPhotoComponent,
  ZVideoComponent,
}                           from './index';


export const ZoneRoutes: RouterConfig = [
  {
    path: 'zone',
    component: ZoneComponent,
    children: [
      {
        path: 'picture', component: ZPictureComponent,
        children: [
          {path: 'photo/:id', component: ZPhotoComponent},
          {path: 'photo', component: ZPhotoComponent},
          {path: 'video/:id', component: ZVideoComponent},
          {path: 'video', component: ZVideoComponent},
          {path: '', component: ZPhotoComponent}
        ]
      },
      {path: '', component: ZPictureComponent}
    ]
  }
];
