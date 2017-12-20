import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FooterComponent, FooterPromotionComponent } from './footer.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [
    FooterComponent,
    FooterPromotionComponent
  ],
  exports: [
    FooterComponent,
    FooterPromotionComponent
  ],
  providers: []
})

export class FooterModule {
}
