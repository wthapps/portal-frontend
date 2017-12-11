import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MyMyAppsComponent } from './my-apps.component';
import { MyMyAppsListComponent } from './list/list.component';
import { MyMyAppsDetailComponent } from './detail/detail.component';
import { MyMyAppsDetailAddComponent } from './detail/detail-add.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'my-apps',
        component: MyMyAppsComponent,
        children: [
          {path: ':id/add', component: MyMyAppsDetailAddComponent},
          {path: ':id/edit/:id_dns', component: MyMyAppsDetailAddComponent},
          {path: ':id', component: MyMyAppsDetailComponent},
          {path: '', component: MyMyAppsListComponent},
          {path: '**', component: MyMyAppsListComponent}
        ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class MyMyAppsRoutingModule {
}
