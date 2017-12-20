import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@shared/services';
import { ZChatHistoryComponent } from './history.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'history',
        component: ZChatHistoryComponent,
        canActivate: [AuthGuard]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZChatHistoryRoutingModule {
}
