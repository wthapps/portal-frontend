import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MyAppsComponent } from './apps.component';
import { MyAppsListComponent } from './list/list.component';
import { MyAppsDetailComponent } from './detail/detail.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'apps',
        component: MyAppsComponent,
        children: [
          {path: ':id', component: MyAppsDetailComponent},
          {path: '', component: MyAppsListComponent},
          {path: '*', component: MyAppsListComponent}
        ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class MyAppsRoutingModule {
}
