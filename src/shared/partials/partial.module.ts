import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CalendarModule, TooltipModule } from 'primeng/primeng';
import { HeaderModule } from '@wth/shared/partials/header';
import { FooterModule } from '@wth/shared/partials/footer';
import { ComponentsModule } from '@shared/components/components.module';
import { TextboxSearchModule } from '@shared/partials/search-box/textbox-search.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CalendarModule,
    TooltipModule,
    ComponentsModule,
    TextboxSearchModule,
    HeaderModule,
    FooterModule
  ],
  declarations: [],
  exports: [HeaderModule, FooterModule, TextboxSearchModule],
  providers: []
})
export class PartialModule {}
