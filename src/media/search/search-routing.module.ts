import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@wth/shared/services';
import { ZMediaSearchComponent } from './search.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'search',
        component: ZMediaSearchComponent,
        canActivate: [AuthGuard]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZMediaSearchRoutingModule {}
