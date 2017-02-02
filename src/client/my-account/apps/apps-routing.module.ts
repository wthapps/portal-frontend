import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ACAppsComponent } from './apps.component';
import { ACAppsListComponent } from './list/list.component';
import { ACAppsDetailComponent } from './detail/detail.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'apps',
        component: ACAppsComponent,
        children: [
          {path: ':id', component: ACAppsDetailComponent},
          {path: '', component: ACAppsListComponent},
          {path: '*', component: ACAppsListComponent}
        ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ACAppsRoutingModule {
}
