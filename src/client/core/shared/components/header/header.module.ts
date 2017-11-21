import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AutoCompleteModule } from 'primeng/components/autocomplete/autocomplete';
import { CalendarModule } from 'primeng/components/calendar/calendar';
import { TooltipModule } from 'primeng/components/tooltip/tooltip';

import { TextBoxSearchComponent } from './search/components/textbox-search.component';
import { PartialsNotificationsModule } from '../notifications/notifications.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    InfiniteScrollModule,
    AutoCompleteModule,
    CalendarModule,
    TooltipModule,

    PartialsNotificationsModule
  ],
  declarations: [
    TextBoxSearchComponent
  ],
  exports: [
    TextBoxSearchComponent
  ],
  providers: []
})

export class HeaderModule {
}
