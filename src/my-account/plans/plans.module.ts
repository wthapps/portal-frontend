import { NgModule } from '@angular/core';
import { MyPlansRoutingModule } from './plans-routing.module';
import { MySharedModule } from '../shared/shared.module';
import { MyPlansComponent } from './plans.component';
import { MyPlansService } from './plans.service';
// import { SharedModule } from '@wth/shared/shared.module';
import { SharedServicesModule } from '@wth/shared/shared-services.module';

@NgModule({
  imports: [
    MyPlansRoutingModule,
    MySharedModule
  ],
  declarations: [MyPlansComponent],
  exports: [MyPlansComponent],
  providers: [MyPlansService]
})
export class MyPlansModule {}
