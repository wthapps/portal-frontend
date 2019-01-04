import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SampleMediaComponent } from './media.component';

const routes: Routes = [
  { path: 'media', component: SampleMediaComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SampleMediaRoutingModule {
}
