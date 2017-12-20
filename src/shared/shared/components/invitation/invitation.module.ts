import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';

import { PipeModule } from '../../pipe/pipe.module';
import { InvitationCreatePartialComponent } from './invitation-create-partial.component';
import { InvitationCreateModalComponent } from './invitation-create-modal.component';
import { InvitationService } from './invitation.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2Bs3ModalModule,
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
