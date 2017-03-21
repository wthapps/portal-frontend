import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZSocialProfileComponent } from './profile.component';
import { ZSocialProfileAboutComponent } from './about/about.component';
import { ZSocialProfilePostComponent } from './post/post.component';


@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'profile', component: ZSocialProfileComponent,
        children: [
          {path: ':id/about', component: ZSocialProfileAboutComponent},
          {path: ':id/post', component: ZSocialProfilePostComponent},
          {path: ':id', component: ZSocialProfilePostComponent},
        ]
      },
    ])
  ],
  exports: [RouterModule]
})
export class ZSocialProfileRoutingModule { }
