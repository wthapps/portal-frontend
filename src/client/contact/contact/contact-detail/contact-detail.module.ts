import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZContactSharedModule } from '../../shared/shared.module';
import { ZContactDetailComponent } from './contact-detail.component';
import { ZContactDetailRoutingModule } from './contact-detail-routing.module';
import { CoreSharedModule } from '../../../core/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    ZContactDetailRoutingModule,
    ZContactSharedModule.forRoot(),
    CoreSharedModule.forRoot()
  ],
  declarations: [
    ZContactDetailComponent
  ],
  exports: [
    ZContactDetailComponent
  ],
  providers: []
})
export class ZContactDetailModule {
}
