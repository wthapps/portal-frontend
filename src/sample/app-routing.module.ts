import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  // { path: '', component: AppComponent },
  { path: '', redirectTo: '/media', pathMatch: 'full' },
  {
    path: 'media',
    loadChildren: './media/media.module#MediaModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
