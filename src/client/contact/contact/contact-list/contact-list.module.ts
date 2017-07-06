import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZContactListRoutingModule } from './contact-list-routing.module';
import { ZContactListComponent } from './contact-list.component';
import { ZContactSharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    ZContactListRoutingModule,
    ZContactSharedModule.forRoot()
  ],
  declarations: [
    ZContactListComponent
  ],
  exports: [
    ZContactListComponent
  ],
  providers: []
})
export class ZContactListModule {
}
