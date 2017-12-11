import { NgModule } from '@angular/core';
import { MyPlansRoutingModule } from './plans-routing.module';
import { MySharedModule } from '../shared/shared.module';
import { MyPlansComponent } from './plans.component';
import { MyPlansService } from './plans.service';
import { SharedModule } from '@wth/shared/shared.module';


@NgModule({
  imports: [
    MyPlansRoutingModule,
    MySharedModule.forRoot(),
    SharedModule.forRoot()
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
