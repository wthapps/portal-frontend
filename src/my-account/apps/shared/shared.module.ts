import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MyAppsSharedCardComponent } from './card/card.component';
import { MyAppsSharedCardPlatformComponent } from './card/platform/platform.component';
import { MyAppsSharedSliderComponent } from './slider/slider.component';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  declarations: [
    MyAppsSharedCardComponent,
    MyAppsSharedCardPlatformComponent,
    MyAppsSharedSliderComponent
  ],
  exports: [
    MyAppsSharedCardComponent,
    MyAppsSharedCardPlatformComponent,
    MyAppsSharedSliderComponent
  ]
})
export class MyAppsSharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: MyAppsSharedModule,
      providers: []
    };
  }
}
