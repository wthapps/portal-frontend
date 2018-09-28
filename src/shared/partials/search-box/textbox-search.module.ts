import { PartialModule } from '@shared/partials/partial.module';
import { InviteContactComponent } from '@shared/partials/invite-contact/invite-contact.component';
import { NgModule } from '@angular/core';
import { TextBoxSearchComponent } from '@shared/partials/search-box';
import { BsModalModule } from 'ng2-bs3-modal';
import { TooltipModule } from 'primeng/primeng';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [TooltipModule, FormsModule, CommonModule, ReactiveFormsModule],
  declarations: [TextBoxSearchComponent],
  exports: [TextBoxSearchComponent],
  providers: []
})
export class TextboxSearchModule {}
