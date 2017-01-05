import { Route } from '@angular/router';
import { ZoneComponent } from './index';
import { ZPictureComponent } from './index';

import { AuthGuard } from '../shared/services/auth-guard.service';

import { ZMediaRoutes } from './media/index';

import { ZSocialRoutes } from './social/index';


export const ZoneRoutes: Route[] = [

  {
    path: 'zone',
    component: ZoneComponent,
    canActivate: [AuthGuard],
    children: [
      ...ZMediaRoutes,
      ...ZSocialRoutes,

      {path: 'picture', component: ZPictureComponent},
      {path: 'picture/:category', component: ZPictureComponent},
      {path: 'picture/:category/:id', component: ZPictureComponent},

      {path: '', component: ZPictureComponent}
    ]
  }
];



