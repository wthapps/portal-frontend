import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ZChatSharedModule } from '../shared/shared.module';
import { CoreSharedModule } from '../../core/shared/shared.module';
import { ZChatSearchRoutingModule } from './search-routing.module';
import { ZChatSearchComponent } from './search.component';


@NgModule({
  imports: [
    ReactiveFormsModule,
    ZChatSearchRoutingModule,
    ZChatSharedModule.forRoot(),
    CoreSharedModule.forRoot()
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
