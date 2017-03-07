import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZMediaFavoriteListComponent } from './favourites-list.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: 'favourites', component: ZMediaFavoriteListComponent}
    ])
  ],
  exports: [RouterModule]
})
export class ZMediaFavoriteRoutingModule {
}
