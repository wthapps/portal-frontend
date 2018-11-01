import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProfileComponent } from '@shared/user';

@NgModule({
  imports: [
    RouterModule.forRoot([
      {
        path: 'notifications',
        loadChildren: './notifications/notifications.module#ContactNotificationModule'
      },
      {  path: 'profile',
         component: ProfileComponent
        // loadChildren: './profile/profile.module#ProfileModule'
      }
    ])
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
