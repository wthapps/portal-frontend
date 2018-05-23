import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactSharedModule } from '../shared/shared.module';
import { BsModalModule } from 'ng2-bs3-modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ZContactSearchRoutingModule } from '@contacts/search/search-routing.module';
import { ContactSearchComponent } from '@contacts/search/search.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BsModalModule,
    ZContactSearchRoutingModule,
    InfiniteScrollModule,
    ContactSharedModule
  ],
  declarations: [ContactSearchComponent],
  exports: [],
  providers: []
})
export class ContactSearchModule {}
