import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard } from '@wth/shared/services';
import { WelcomeComponent } from './welcome.component';
import { TakeATourComponent } from './takeatour/takeatour.component';
import { WelcomeDoneComponent } from './done/done.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'welcome',
        component: WelcomeComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'takeatour',
        component: TakeATourComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'welcome/done',
        component: WelcomeDoneComponent,
        canActivate: [AuthGuard]
      }
    ])
  ],
  exports: [RouterModule]
})
export class WelcomeRoutingModule {}
