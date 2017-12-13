import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@wth/shared/services';

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: '', redirectTo: '/my-note', pathMatch: 'full', canActivate: [AuthGuard]}
    ])
  ],
  exports: [RouterModule]
})
export class BaseHomeRoutingModule {
}
