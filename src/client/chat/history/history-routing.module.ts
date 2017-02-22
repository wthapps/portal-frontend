import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZChatHistoryComponent } from './history.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'history',
        component: ZChatHistoryComponent
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZChatHistoryRoutingModule {
}
