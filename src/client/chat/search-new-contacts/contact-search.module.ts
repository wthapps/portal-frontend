import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ChatSharedModule } from '../shared/shared.module';
import { SharedModule } from '../../core/shared/shared.module';
import { ZChatContactSearchRoutingModule } from './contact-search-routing.module';
import { ZChatContactSearchComponent } from './contact-search.component';


@NgModule({
  imports: [
    ReactiveFormsModule,
    ZChatContactSearchRoutingModule,
    SharedModule.forRoot(),
    ChatSharedModule.forRoot()
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
