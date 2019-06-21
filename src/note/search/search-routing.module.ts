import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZNoteSearchComponent } from './search.component';
import { AuthGuard } from '@wth/shared/services';
import { SubscriptionGuard } from '@shared/guards';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'search',
        component: ZNoteSearchComponent,
        canActivate: [AuthGuard, SubscriptionGuard]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZNoteSearchRoutingModule {}
