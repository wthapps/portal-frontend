import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { BsModalModule } from 'ng2-bs3-modal';
import { CheckboxModule, TooltipModule } from 'primeng/primeng';
import { PipeModule } from '@shared/shared/pipe/pipe.module';

import {
  CardItemComponent,
  CardListComponent,
  CardDetailModalComponent,
  CardEditModalComponent
} from './components';

import { CardRoutingModule } from './card-routing';
import { CardService } from './card.service';
import { AutofocusModule } from '@shared/directives/autofocus';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CardRoutingModule,
    BsModalModule,
    CheckboxModule,
    TooltipModule,
    PipeModule,
    AutofocusModule
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
