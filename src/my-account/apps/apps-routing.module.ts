import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard } from '@shared/services';
import { MyAppsComponent } from './apps.component';
import { MyAppsListComponent } from './list/list.component';
import { MyAppsDetailComponent } from './detail/detail.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'apps',
        component: MyAppsComponent,
        canActivate: [AuthGuard],
        children: [
          { path: ':id', component: MyAppsDetailComponent },
          { path: '', component: MyAppsListComponent },
          { path: '*', component: MyAppsListComponent }
        ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class MyAppsRoutingModule {}
