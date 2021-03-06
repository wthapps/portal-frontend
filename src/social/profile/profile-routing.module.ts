import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZSocialProfileComponent } from './profile.component';
import { ZSocialProfileAboutComponent } from './about/about.component';
import { ZSocialProfilePostComponent } from './post/post.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: ':id',
        component: ZSocialProfileComponent,
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'post' },
          { path: 'about', component: ZSocialProfileAboutComponent },
          { path: 'post', component: ZSocialProfilePostComponent }
        ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ProfileRoutingModule {}
