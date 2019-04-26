import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MyMyAppsListComponent } from '@account/my-apps/list/list.component';

@NgModule({
  imports: [
    RouterModule.forRoot([
      /* define app module routes here, e.g., to lazily load a module
         (do not place feature module routes here, use an own -routing.module.ts in the feature instead)
       */
      {
        path: '',
        redirectTo: '/settings/profile',
        pathMatch: 'full'
      },
      {
        path: 'contact',
        loadChildren: './contact-us/contact.module#ContactUsModule'
      },
      {
        path: 'notifications',
        loadChildren:
          './notifications/notifications.module#MyNotificationModule'
      },
      // {
      //   path: 'dashboard',
      //   children: [
      //     {
      //       path: '',
      //       loadChildren: './dashboard/dashboard.module#DashboardModule'
      //     }
      //   ]
      // }
    ])
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
