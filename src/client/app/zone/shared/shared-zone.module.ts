import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZoneMenuComponent } from './index';



/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [RouterModule],
  declarations: [
    ZoneMenuComponent
  ],
  exports: [
    ZoneMenuComponent,
    RouterModule
  ]
})
export class SharedZoneModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedZoneModule,
      providers: [
      ]
    };
  }
}
