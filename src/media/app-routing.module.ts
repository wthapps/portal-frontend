import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: 'notifications', loadChildren: './notifications/notifications.module#MediaNotificationModule'},
    ])
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

