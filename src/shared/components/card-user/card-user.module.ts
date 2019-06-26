import { NgModule } from '@angular/core';
import { CardUserComponent } from './card-user.component';
import { CommonModule } from '@angular/common';
import { BsModalModule } from 'ng2-bs3-modal';

@NgModule({
  imports: [CommonModule, BsModalModule],
  declarations: [CardUserComponent],
  exports: [CardUserComponent],
  providers: []
})
export class CardUserModule {}
