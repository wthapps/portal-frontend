import { NgModule } from '@angular/core';

import { WelcomeRoutingModule } from './welcome-routing.module';
import { WelcomeComponent } from './welcome.component';
import { TakeATourComponent } from './takeatour/takeatour.component';
import { MySharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    WelcomeRoutingModule,
    MySharedModule
  ],
  declarations: [
    WelcomeComponent,
    TakeATourComponent
  ],
  exports: [
    WelcomeComponent,
    TakeATourComponent
  ]
})

export class WelcomeModule {
}
