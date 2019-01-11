import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SampleMediaComponent } from './media.component';
import { SampleMediaListComponent } from './list/list.component';

const routes: Routes = [
  {
    path: '',
    component: SampleMediaComponent,
    children: [
      {
        path: '',
        component: SampleMediaListComponent
      },
      {
        path: ':type',
        component: SampleMediaListComponent
      },
      {
        path: ':type/:id',
        component: SampleMediaListComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SampleMediaRoutingModule {
}
