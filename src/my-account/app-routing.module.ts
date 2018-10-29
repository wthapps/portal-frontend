import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forRoot([
      /* define app module routes here, e.g., to lazily load a module
         (do not place feature module routes here, use an own -routing.module.ts in the feature instead)
       */

      {
        path: 'contact',
        loadChildren: './contact-us/contact.module#ContactUsModule'
      },
      {
        path: 'dashboard',
        children: [
          {
            path: '',
            loadChildren: './dashboard/dashboard.module#DashboardModule'
          }
        ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
