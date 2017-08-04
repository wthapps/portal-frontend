import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AutoCompleteModule } from 'primeng/components/autocomplete/autocomplete';
import { CalendarModule } from 'primeng/components/calendar/calendar';
import { TooltipModule } from 'primeng/components/tooltip/tooltip';

import { HeaderComponent } from './header.component';
import { SearchFormComponent } from './search/search-form.component';
import { PhotoSearchFormComponent } from './search/photo-search-form.component';
import { SocialSearchFormComponent } from './search/social-search-form.component';
import { ChatSearchFormComponent } from './search/chat-search-form.component';
import { TextBoxSearchComponent } from './search/components/textbox-search.component';
import { ContactSearchFormComponent } from './search/contact-search-form.component';
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
    HeaderComponent,
    SearchFormComponent,
    PhotoSearchFormComponent,
    SocialSearchFormComponent,
    ChatSearchFormComponent,
    TextBoxSearchComponent,
    ContactSearchFormComponent
  ],
  exports: [
    HeaderComponent,
    SearchFormComponent,
    PhotoSearchFormComponent,
    SocialSearchFormComponent,
    ChatSearchFormComponent,
    TextBoxSearchComponent,
    ContactSearchFormComponent
  ],
  providers: []
})

export class HeaderModule {
}
