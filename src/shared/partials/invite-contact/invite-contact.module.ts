import { InviteContactComponent } from '@shared/partials/invite-contact/invite-contact.component';
import { NgModule } from '@angular/core';
import { BsModalModule } from 'ng2-bs3-modal';
import { TooltipModule, CheckboxModule } from 'primeng/primeng';
import { TextboxSearchModule } from '@shared/partials/search-box/textbox-search.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AutoCompleteModule } from 'primeng/components/autocomplete/autocomplete';
import { PipeModule } from '@shared/shared/pipe/pipe.module';
import { BoxLoadingModule } from '@shared/shared/components/box-loading/box-loading.module';
import { InvitationModule } from '@shared/shared/components/invitation/invitation.module';

@NgModule({
  imports: [
    BsModalModule,
    TooltipModule,
    TextboxSearchModule,
    FormsModule,
    CommonModule,
    AutoCompleteModule,
    PipeModule,
    BoxLoadingModule,
    CheckboxModule,
    InvitationModule,
    ReactiveFormsModule
  ],
  declarations: [InviteContactComponent],
  exports: [InviteContactComponent],
  providers: []
})
export class InviteContactModule {}
