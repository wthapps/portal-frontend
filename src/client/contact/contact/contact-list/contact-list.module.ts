import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZContactListRoutingModule } from './contact-list-routing.module';
import { ZContactListComponent } from './contact-list.component';
import { ZContactSharedModule } from '../../shared/shared.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  imports: [
    CommonModule,
    InfiniteScrollModule,
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
