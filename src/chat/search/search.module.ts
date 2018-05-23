import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ZChatSharedModule } from '../shared/shared.module';
import { ZChatSearchRoutingModule } from './search-routing.module';
import { ZChatSearchComponent } from './search.component';
import { SharedModule } from '@wth/shared/shared.module';
import { SharedServicesModule } from '@wth/shared/shared-services.module';

@NgModule({
  imports: [
    ReactiveFormsModule,
    ZChatSearchRoutingModule,
    ZChatSharedModule.forRoot(),
    SharedModule.forRoot(),
    SharedServicesModule.forRoot()
  ],
  declarations: [ZChatSearchComponent],
  exports: [ZChatSearchComponent],
  providers: []
})
export class ZChatSearchModule {}
