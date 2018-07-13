import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactHtmlComponent } from '@contacts/html/contact-html.component';
import { ContactHtmlRoutingModule } from '@contacts/html/contact-html-routing.module';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    ContactHtmlRoutingModule,
    SharedModule
  ],
  declarations: [
    ContactHtmlComponent
  ],
  exports: [
    ContactHtmlComponent
  ],
  providers: []
})
export class ContactHtmlModule {}
