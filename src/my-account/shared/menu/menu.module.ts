import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MySharedMenuComponent } from './menu.component';

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [MySharedMenuComponent],
  exports: [MySharedMenuComponent]
})
export class MySharedMenuModule {}
