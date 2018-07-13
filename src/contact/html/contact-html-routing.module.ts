import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ContactHtmlComponent } from '@contacts/html/contact-html.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'html',
        component: ContactHtmlComponent
      }
    ])
  ],
  exports: [RouterModule]
})
export class ContactHtmlRoutingModule {
}
