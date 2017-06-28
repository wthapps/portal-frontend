import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZChatContactSearchComponent } from './contact-search.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'search_new_contacts',
        component: ZChatContactSearchComponent
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZChatContactSearchRoutingModule {
}
