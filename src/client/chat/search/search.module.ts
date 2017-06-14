import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ChatSharedModule } from '../shared/shared.module';
import { SharedModule } from '../../core/shared/shared.module';
import { ZChatSearchRoutingModule } from './search-routing.module';
import { ZChatSearchComponent } from './search.component';


@NgModule({
  imports: [
    ReactiveFormsModule,
    ZChatSearchRoutingModule,
    SharedModule.forRoot(),
    ChatSharedModule.forRoot()
  ],
  declarations: [
    ZChatSearchComponent
  ],
  exports: [
    ZChatSearchComponent
  ],
  providers: []
})

export class ZChatSearchModule {
}
