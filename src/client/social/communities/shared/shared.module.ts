import { NgModule, ModuleWithProviders } from '@angular/core';

import { ZSocialSharedModule } from '../../shared/shared.module';
import { CoreSharedModule } from '../../../core/shared/shared.module';
import { Ng2HdModule } from '../../../core/shared/ng2-hd/ng2-hd.module';

// import { ZSocialCommunityFormEditComponent } from './form/edit.component';
// import { ZSocialCommunityFormPreferenceComponent } from './form/preferences.component';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    ZSocialSharedModule.forRoot(),
    CoreSharedModule.forRoot()
  ],
  // declarations: [
  //   ZSocialCommunityFormEditComponent,
  //   ZSocialCommunityFormPreferenceComponent
  // ],
  // exports: [
  //   ZSocialCommunityFormEditComponent,
  //   ZSocialCommunityFormPreferenceComponent
  // ]
})
export class ZSocialCommunitySharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ZSocialCommunitySharedModule,
      providers: []
    };
  }
}
