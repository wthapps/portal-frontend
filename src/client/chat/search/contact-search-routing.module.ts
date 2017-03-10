import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZChatContactSearchComponent } from './contact-search.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'search',
        component: ZChatContactSearchComponent
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZChatContactSearchRoutingModule {
}
