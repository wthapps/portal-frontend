import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ContactHtmlCardsComponent } from '@contacts/html/cards/cards.component';
import { ContactHtmlComponent } from '@contacts/html/contact-html.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'html/cards',
        component: ContactHtmlCardsComponent
      },
      {
        path: 'html',
        component: ContactHtmlComponent
      },
    ])
  ],
  exports: [RouterModule]
})
export class ContactHtmlRoutingModule {
}
