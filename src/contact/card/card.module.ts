import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  CardItemComponent,
  CardListComponent,
  CardDetailModalComponent,
  CardEditModalComponent
} from '@contacts/card/components';

import { CardRoutingModule } from '@contacts/card/card-routing';
import { CardService } from './card.service';
import { BsModalModule } from 'ng2-bs3-modal';
import { CheckboxModule, TooltipModule } from 'primeng/primeng';

import { PipeModule } from '@shared/shared/pipe/pipe.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CardRoutingModule,
    BsModalModule,
    CheckboxModule,
    TooltipModule,
    PipeModule,
  ],
  declarations: [
    CardItemComponent,
    CardDetailModalComponent,
    CardEditModalComponent,
    CardListComponent,
  ],
  exports: [
    CardItemComponent,
    CardDetailModalComponent,
    CardEditModalComponent,
    CardListComponent,
  ],
  providers: [
    CardService
  ]
})
export class CardModule {
}
