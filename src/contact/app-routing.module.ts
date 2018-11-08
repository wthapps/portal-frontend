import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProfileComponent } from '@shared/user';
import { ProfilePageComponent } from '@contacts/profile/profile-page.component';

@NgModule({
  imports: [
    RouterModule.forRoot([
      {
        path: 'notifications',
        loadChildren: './notifications/notifications.module#ContactNotificationModule'
      },
      // {  path: 'profile',
      //    component: ProfileComponent
      //   // loadChildren: './profile/profile.module#ProfileModule'
      // },
      {
        path: 'profile',
        component: ProfilePageComponent
         // loadChildren: './profile/profile-page.module#ProfilePageModule'
      }
    ])
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
