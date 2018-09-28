import { InviteContactComponent } from '@shared/partials/invite-contact/invite-contact.component';
import { NgModule } from '@angular/core';
import { BsModalModule } from 'ng2-bs3-modal';
import { TooltipModule } from 'primeng/primeng';
import { TextboxSearchModule } from '@shared/partials/search-box/textbox-search.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AutoCompleteModule } from 'primeng/components/autocomplete/autocomplete';
import { WthFilterByPipe } from '@shared/shared/pipe/wthFilterBy.pipe';
import { PipeModule } from '@shared/shared/pipe/pipe.module';
import { BoxLoadingModule } from '@shared/shared/components/box-loading/box-loading.module';

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
    ReactiveFormsModule
  ],
  declarations: [InviteContactComponent],
  exports: [InviteContactComponent],
  providers: []
})
export class InviteContactModule {}
