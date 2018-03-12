import { NgModule } from '@angular/core';

import { AuthService } from '../../shared/services/auth.service';
import { AppearancesChannelService } from '../../shared/channels/appearances-channel.service';

import { LoginComponent } from './login.component';
import { LoginRoutingModule } from './login-routing.module';
import { PortalSharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    LoginRoutingModule,
    PortalSharedModule
  ],
  declarations: [LoginComponent],
  exports: [LoginComponent],
  providers: [
    AuthService,
    AppearancesChannelService
  ]
})

export class LoginModule {
}
