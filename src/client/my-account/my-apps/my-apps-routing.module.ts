import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ACMyAppsComponent } from './my-apps.component';
import { ACMyAppsListComponent } from './list/list.component';
import { ACMyAppsDetailComponent } from './detail/detail.component';
import { ACMyAppsDetailAddComponent } from './detail/detail-add.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'my-apps',
        component: ACMyAppsComponent,
        children: [
          {path: ':id/add', component: ACMyAppsDetailAddComponent},
          {path: ':id/edit/:id_dns', component: ACMyAppsDetailAddComponent},
          {path: ':id', component: ACMyAppsDetailComponent},
          {path: '', component: ACMyAppsListComponent},
          {path: '**', component: ACMyAppsListComponent}
        ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ACMyAppsRoutingModule {
}
