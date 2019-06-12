import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountDeletedRoutingModule } from './account-deleted-routing.module';
import { AccountDeletedComponent } from './account-deleted.component';

@NgModule({
  declarations: [AccountDeletedComponent],
  imports: [CommonModule, AccountDeletedRoutingModule],
  exports: [AccountDeletedComponent]
})
export class AccountDeletedModule {}
