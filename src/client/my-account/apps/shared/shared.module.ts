import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ACAppsSharedCardComponent } from './card/card.component';
import { ACAppsSharedCardPlatformComponent } from './card/platform/platform.component';
import { ACAppsSharedSliderComponent } from './slider/slider.component';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [
    ACAppsSharedCardComponent,
    ACAppsSharedCardPlatformComponent,
    ACAppsSharedSliderComponent
  ],
  exports: [
    CommonModule,
    ACAppsSharedCardComponent,
    ACAppsSharedCardPlatformComponent,
    ACAppsSharedSliderComponent
  ]
})
export class ACAppsSharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ACAppsSharedModule,
      providers: []
    };
  }
}
