import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { WListComponent } from './list-component.component';
import { WListItemComponentModule } from './item/list-item-component.module';
import { WListItemComponent } from './item/list-item-component.component';

@NgModule({
  imports: [CommonModule, WListItemComponentModule],
  declarations: [WListComponent],
  exports: [WListComponent, WListItemComponentModule],
  providers: []
})
export class WListComponentModule { }
