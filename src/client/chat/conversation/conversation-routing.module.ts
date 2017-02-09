import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ACAppsComponent } from './apps.component';
import { ACAppsListComponent } from './list/list.component';
import { ACAppsDetailComponent } from './detail/detail.component';
import { ZChatConversationGlobalComponent } from './conversation-global.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'conversation',
        component: ZChatConversationGlobalComponent
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZChatConversationRoutingModule {
}
