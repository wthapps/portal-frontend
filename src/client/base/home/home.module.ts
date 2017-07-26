import { NgModule } from '@angular/core';
import { BaseHomeRoutingModule } from './home-routing.module';
import { BaseSharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    BaseHomeRoutingModule,
    BaseSharedModule
  ],
  declarations: [
  ],
  exports: [
  ],
  providers: [
  ]
})
export class BaseHomeModule { }
