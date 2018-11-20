import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  CardItemComponent,
  CardListComponent,
  CardDetailModalComponent,
  CardEditModalComponent
} from '@contacts/card/components';
import { CardDetailComponent } from '@contacts/card/components/card-detail.component';

import { CardRoutingModule } from '@contacts/card/card-routing';
import { CardService } from '@contacts/card';

import { SharedModule } from '@shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    CardRoutingModule,
    SharedModule
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
