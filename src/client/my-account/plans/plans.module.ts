import { NgModule } from '@angular/core';
import { MyPlansRoutingModule } from './plans-routing.module';
import { MySharedModule } from '../shared/shared.module';
import { CoreSharedModule } from '../../core/shared/shared.module';
import { MyPlansComponent } from './plans.component';
import { MyPlansService } from './plans.service';


@NgModule({
  imports: [
    MyPlansRoutingModule,
    MySharedModule.forRoot(),
    CoreSharedModule.forRoot()
  ],
  declarations: [
    MyPlansComponent
  ],
  exports: [
    MyPlansComponent
  ],
  providers: [MyPlansService]
})

export class MyPlansModule {
}
