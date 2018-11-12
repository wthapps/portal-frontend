import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ZChatSharedModule } from '../shared/shared.module';
import { ZChatContactSearchRoutingModule } from './contact-search-routing.module';
import { ZChatContactSearchComponent } from './contact-search.component';
import { SharedModule } from '@wth/shared/shared.module';
// import { SharedServicesModule } from '@wth/shared/shared-services.module';

@NgModule({
  imports: [
    ReactiveFormsModule,
    ZChatContactSearchRoutingModule,
    ZChatSharedModule.forRoot(),
    SharedModule.forRoot(),
    // SharedServicesModule.forRoot()
  ],
  declarations: [ZChatContactSearchComponent],
  exports: [ZChatContactSearchComponent],
  providers: []
})
export class ZChatContactSearchModule {}
