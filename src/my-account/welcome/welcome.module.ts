import { NgModule } from '@angular/core';

import { WelcomeRoutingModule } from './welcome-routing.module';
import { WelcomeComponent } from './welcome.component';
import { TakeATourComponent } from './takeatour/takeatour.component';
import { MySharedModule } from '../shared/shared.module';
import { WelcomeDoneComponent } from './done/done.component';

@NgModule({
  imports: [WelcomeRoutingModule, MySharedModule],
  declarations: [WelcomeComponent, TakeATourComponent, WelcomeDoneComponent]
})
export class WelcomeModule {}
