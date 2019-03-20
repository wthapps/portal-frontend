import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { WListItemComponent } from './list-item-component.component';

@NgModule({
  imports: [CommonModule],
  declarations: [WListItemComponent],
  exports: [WListItemComponent],
  providers: []
})
export class WListItemComponentModule { }
