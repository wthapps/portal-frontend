import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MediaComponent } from './media.component';
import { MPhotosComponent } from './list/photos.component';

const routes: Routes = [
  {
    path: '',
    component: MediaComponent,
    children: [
      // { path: '', redirectTo: 'photos', pathMatch: 'full' },
      {
        path: '',
        component: MPhotosComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MediaRoutingModule {
}
