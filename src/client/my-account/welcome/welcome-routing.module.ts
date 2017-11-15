import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { WelcomeComponent } from './welcome.component';
import { TakeATourComponent } from './takeatour/takeatour.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: 'welcome', component: WelcomeComponent},
      {path: 'takeatour', component: TakeATourComponent},
    ])
  ],
  exports: [RouterModule]
})
export class WelcomeRoutingModule {
}
