import { Routes, RouterModule } from '@angular/router';
import { ZSocialHomeComponent } from './home/home.component';
import { ZSocialNotificationsComponent } from './notifications/notifications.component';
import { ZSocialProfileComponent } from './shared/profile/profile.component';
import { ZSocialProfileAboutComponent } from './shared/profile/about/about.component';
import { PostDetailComponent } from './shared/post/post-detail.component';
import { ModuleWithProviders } from '@angular/core';

// import { AboutRoutes } from './about/index';
// import { HomeRoutes } from './home/index';
// import {
//   LoginRoutes
//   //, authProviders
// } from './login/index';
// import { RegisterRoutes } from './register/index';
// import { ProductsRoutes } from './products/index';
// import { PricingRoutes } from './pricing/index';
// import { ContactRoutes } from './contact/index';
// import { SupportRoutes } from './support/index';
// import { PoliciesRoutes } from './policies/index';
// import { WelcomeRoutes } from './welcome/index';
// import { ComingsoonRoutes } from './comingsoon/index';
// import { AccountRoutes } from './account/index';
// import { ZoneRoutes } from './zone/index';

export const routes: Routes = [
  {
  path: 'home', component: ZSocialHomeComponent
},
  {
    path: 'profile', component: ZSocialProfileComponent,
    children: [
      {path: ':id/about', component: ZSocialProfileAboutComponent},
      // {path: ':id/post', component: ZSocialProfilePostComponent},
      // {path: ':id', component: ZSocialProfilePostComponent},
      // {path: '', component: ZSocialProfilePostComponent}
    ]
  },
  {
    path: 'notifications', component: ZSocialNotificationsComponent
  },
  { path: 'posts/:id', component: PostDetailComponent },
  // { path: 'communities', loadChildren: './social/communities/communities.module#ZSocialCommunityModule'}
// ...HomeRoutes,
  // ...AboutRoutes,
  // ...LoginRoutes,
  // ...RegisterRoutes,
  // ...ProductsRoutes,
  // ...PricingRoutes,
  // ...ContactRoutes,
  // ...SupportRoutes,
  // ...PoliciesRoutes,
  // ...WelcomeRoutes,
  // ...ComingsoonRoutes,
  // ...AccountRoutes,
  // ...ZoneRoutes
];


export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
