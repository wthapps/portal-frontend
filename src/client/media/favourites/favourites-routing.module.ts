import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZMediaFavoriteListComponent } from './favourites-list.component';
import { ZMediaFavoriteDetailComponent } from './favourites-detail.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: 'favourites', component: ZMediaFavoriteListComponent},
      {path: 'favourites/:id', component: ZMediaFavoriteDetailComponent}
    ])
  ],
  exports: [RouterModule]
})
export class ZMediaFavoriteRoutingModule {
}
