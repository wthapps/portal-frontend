import {RouterConfig}       from '@angular/router';

import {
  ZoneComponent,
  ZPictureComponent,
  ZPhotoComponent,
  ZVideoComponent,
}                           from './index';

import {
  ZPhotoListComponent,
}                           from './+picture/+photo/photo-list.component';


export const ZoneRoutes: RouterConfig = [
  {
    path: 'zone',
    component: ZoneComponent,
    children: [
      {
        path: 'picture', component: ZPictureComponent,
        children: [
          {path: 'photo/list', component: ZPhotoListComponent},
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
