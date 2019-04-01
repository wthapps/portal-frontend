import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BsModalModule } from 'ng2-bs3-modal';
import { CheckboxModule, TooltipModule } from 'primeng/primeng';
import { PipeModule } from '@shared/shared/pipe/pipe.module';

import {
  CardItemComponent,
  CardListComponent,
  CardEditModalComponent
} from './components';

import { CardRoutingModule } from './card-routing';
import { CardService } from './card.service';
import { AutofocusModule } from '@shared/directives/autofocus';
import { ZContactPipeModule } from '../pipe/pipe.module';
import { UserCardModule } from '@shared/user/card';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardRoutingModule,
    BsModalModule,
    CheckboxModule,
    TooltipModule,
    PipeModule,
    ZContactPipeModule,
    AutofocusModule,
    UserCardModule,
  ],
  declarations: [
    CardItemComponent,
    CardEditModalComponent,
    CardListComponent
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,

    CardItemComponent,
    CardEditModalComponent,
    CardListComponent
  ],
  providers: [CardService]
})
export class CardModule {}
