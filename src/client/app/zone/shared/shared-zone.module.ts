import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZoneMenuComponent } from './index';

import { SharedModule } from '../../shared/shared.module';
import { Ng2HdModule } from './ng2-hd/ng2-hd.module';
import { SocialService, SoUserService, SoPostService } from '../social/services/social.service';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    RouterModule,
    SharedModule,
    Ng2HdModule
  ],
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
      providers: [SocialService, SoUserService, SoPostService]
    };
  }
}
