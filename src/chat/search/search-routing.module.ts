import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZChatSearchComponent } from './search.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'search',
        component: ZChatSearchComponent
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZChatSearchRoutingModule {
}
