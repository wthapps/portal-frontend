import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BsModalModule } from 'ng2-bs3-modal';

import { PipeModule } from '../../pipe/pipe.module';
import { InvitationCreatePartialComponent } from './invitation-create-partial.component';
import { InvitationCreateModalComponent } from './invitation-create-modal.component';
import { InvitationService } from './invitation.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BsModalModule,
    PipeModule
  ],
  declarations: [
    InvitationCreatePartialComponent,
    InvitationCreateModalComponent
  ],
  exports: [
    InvitationCreatePartialComponent,
    InvitationCreateModalComponent
  ],
  providers: [InvitationService]
})

export class InvitationModule {
}
