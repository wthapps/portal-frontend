import { NgModule, ModuleWithProviders } from '@angular/core';
import { ZSocialSharedModule } from '../../shared/shared.module';
// import { SharedModule } from '@wth/shared/shared.module';


@NgModule({
  imports: [
    ZSocialSharedModule,
    // SharedModule
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
