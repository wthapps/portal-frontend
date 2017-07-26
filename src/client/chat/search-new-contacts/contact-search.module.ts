import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ZChatSharedModule } from '../shared/shared.module';
import { CoreSharedModule } from '../../core/shared/shared.module';
import { ZChatContactSearchRoutingModule } from './contact-search-routing.module';
import { ZChatContactSearchComponent } from './contact-search.component';


@NgModule({
  imports: [
    ReactiveFormsModule,
    ZChatContactSearchRoutingModule,
    ZChatSharedModule.forRoot(),
    CoreSharedModule.forRoot()
  ],
  declarations: [
    ZChatContactSearchComponent
  ],
  exports: [
    ZChatContactSearchComponent
  ],
  providers: []
})

export class ZChatContactSearchModule {
}
