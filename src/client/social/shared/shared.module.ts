import { NgModule, ModuleWithProviders } from '@angular/core';
import { ZSocialFavoritesComponent } from './favorites/social-favorites.component';

import { SharedModule } from '../../core/shared/shared.module';

import { SoUserService, SocialService, SoPostService } from './services/social.service';
import {SoCommunityService} from "./services/community.service";



/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    ZSocialFavoritesComponent
  ],
  exports: [
    ZSocialFavoritesComponent,

    SharedModule
  ]
})
export class ZSocialSharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ZSocialSharedModule,
      providers: [SocialService, SoUserService, SoPostService, SoCommunityService]
    };
  }
}
