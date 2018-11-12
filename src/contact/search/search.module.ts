import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactSharedModule } from '../shared/shared.module';
import { BsModalModule } from 'ng2-bs3-modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ZContactSearchRoutingModule } from '@contacts/search/search-routing.module';
import { ContactSearchComponent } from '@contacts/search/search.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { InvitationModule } from '@shared/shared/components/invitation/invitation.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BsModalModule,
    ZContactSearchRoutingModule,
    InvitationModule,
    InfiniteScrollModule,
    ContactSharedModule
  ],
  declarations: [ContactSearchComponent],
  exports: [],
  providers: []
})
export class ContactSearchModule {}
