import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CalendarModule, TooltipModule } from 'primeng/primeng';
import { HeaderModule } from '@wth/shared/partials/header';
import { TextBoxSearchComponent } from '@wth/shared/partials/search-box';
import { FooterModule } from '@wth/shared/partials/footer';
import { ComponentsModule } from '@shared/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CalendarModule,
    TooltipModule,
    ComponentsModule,

    HeaderModule,
    FooterModule
  ],
  declarations: [TextBoxSearchComponent],
  exports: [HeaderModule, FooterModule, TextBoxSearchComponent],
  providers: []
})
export class PartialModule {}
