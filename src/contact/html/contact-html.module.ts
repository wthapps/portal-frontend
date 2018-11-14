import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ContactHtmlCardsComponent } from '@contacts/html/cards/cards.component';
import { ContactHtmlRoutingModule } from '@contacts/html/contact-html-routing.module';
import { ContactHtmlComponent } from '@contacts/html/contact-html.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    ContactHtmlRoutingModule,
    SharedModule
  ],
  declarations: [
    ContactHtmlComponent,
    ContactHtmlCardsComponent
  ],
  exports: [
    ContactHtmlComponent,
    ContactHtmlCardsComponent
  ],
  providers: []
})
export class ContactHtmlModule {
}
