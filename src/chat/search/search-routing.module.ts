import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@shared/services';
import { ZChatSearchComponent } from './search.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'search',
        component: ZChatSearchComponent,
        canActivate: [AuthGuard]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZChatSearchRoutingModule {}
