import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: '', redirectTo: '/conversations', pathMatch: 'full'}
    ])
  ],
  exports: [RouterModule]
})
export class ZChatHomeRoutingModule {
}
