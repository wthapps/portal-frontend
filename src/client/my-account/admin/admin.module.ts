import { NgModule } from '@angular/core';
import { MySharedModule } from '../shared/shared.module';
import { CoreSharedModule } from '../../core/shared/shared.module';
import { MyAdminRoutingModule } from './admin-routing.module';
import { MyInvitationsComponent } from './invitations/invitations.component';
import { MyAdminComponent } from './admin.component';


@NgModule({
  imports: [
    MyAdminRoutingModule,
    MySharedModule.forRoot(),
    CoreSharedModule.forRoot()
  ],
  declarations: [
    MyAdminComponent,
    MyInvitationsComponent,
  ],
  exports: [
    MyAdminComponent,
    MyInvitationsComponent
  ],
  providers: []
})

export class MyAdminModule {
}
