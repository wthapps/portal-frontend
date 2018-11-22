import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  CardItemComponent,
  CardListComponent,
  CardDetailModalComponent,
  CardEditModalComponent
} from '@contacts/card/components';
import { CardDetailComponent } from '@contacts/card/components/card-detail.component';

import { CardRoutingModule } from '@contacts/card/card-routing';
import { CardService } from '@contacts/card';
import { BsModalModule } from 'ng2-bs3-modal';
import { CheckboxModule } from 'primeng/primeng';

import { SharedModule } from '@shared/shared.module';
import { PipeModule } from '@shared/shared/pipe/pipe.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CardRoutingModule,
    BsModalModule,
    CheckboxModule,
    PipeModule,
    // SharedModule
  ],
  declarations: [
    CardItemComponent,
    CardDetailModalComponent,
    CardEditModalComponent,
    CardListComponent,
    CardDetailComponent,
  ],
  exports: [
    CardItemComponent,
    CardDetailModalComponent,
    CardEditModalComponent,
    CardListComponent,
    CardDetailComponent,
  ],
  providers: [
    CardService
  ]
})
export class CardModule {
}
