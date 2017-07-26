import { NgModule } from '@angular/core';
import { MyHomeRoutingModule } from './home-routing.module';
import { MySharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    MyHomeRoutingModule,
    MySharedModule
  ],
  declarations: [
  ],
  exports: [
  ],
  providers: [
  ]
})
export class MyHomeModule { }
