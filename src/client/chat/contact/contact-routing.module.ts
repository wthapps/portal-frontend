import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZChatContactComponent } from './contact.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'contact',
        component: ZChatContactComponent
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZChatContactRoutingModule {
}
