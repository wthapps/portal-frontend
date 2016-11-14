import { Route } from '@angular/router';
import { ZoneComponent } from './index';
import { ZPictureComponent } from './index';
import { ZSocialComponent } from './social/index';
import { ZSocialTempComponent } from './social/social-temp.component';
import { ZSocialTempDetailComponent } from './social/social-temp-detail.component';

import { AuthGuard } from "../shared/services/auth-guard.service";
import { ZSocialCommunityTempComponent } from './social/communities-temp.component';
import { ZSocialPostDetailComponent } from './social/post-detail/post-detail.component';
import { ZSocialPhotoDetailComponent } from './social/photo-detail/photo-detail.component';
import { ZSocialProfileComponent } from './social/profile/profile.component';
import { ZSocialHtmlComponent } from './social/social-html.component';

export const ZoneRoutes: Route[] = [
  {
    path: 'zone',
    component: ZoneComponent,
    canActivate: [AuthGuard],
    children: [
      {path: 'picture', component: ZPictureComponent},
      {path: 'picture/:category', component: ZPictureComponent},
      {path: 'picture/:category/:id', component: ZPictureComponent},

      {path: 'social', component: ZSocialComponent},
      {path: 'social/posts/:id', component: ZSocialPostDetailComponent},
      {path: 'social/photos/:id', component: ZSocialPhotoDetailComponent},
      {path: 'social/profile', component: ZSocialProfileComponent},
      {path: 'social-temp', component: ZSocialTempComponent},
      {path: 'social-temp-detail', component: ZSocialTempDetailComponent},
      {path: 'social-communities-temp', component: ZSocialCommunityTempComponent},
      {path: 'social-html', component: ZSocialHtmlComponent},

      {path: '', component: ZPictureComponent}
    ]
  }
];



