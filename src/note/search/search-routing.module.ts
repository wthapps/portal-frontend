import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZNoteSearchComponent } from './search.component';
import { AuthGuard } from '@wth/shared/services';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'search',
        component: ZNoteSearchComponent,
        canActivate: [AuthGuard]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZNoteSearchRoutingModule {
}
