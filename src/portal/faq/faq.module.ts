import { NgModule } from '@angular/core';
import { FaqRoutingModule } from '@portal/faq/faq-routing.module';
import { PortalSharedModule } from '@portal/shared/shared.module';
import { FaqComponent } from '@portal/faq/faq.component';
import { FaqService } from '@portal/faq/faq.service';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { FaqCategoryService } from '@portal/faq/faq-category.service';


@NgModule({
  imports: [
    FaqRoutingModule,
    PortalSharedModule,
    ScrollToModule.forRoot()
  ],
  declarations: [
    FaqComponent
  ],
  exports: [
    FaqComponent
  ],
  providers: [
    FaqService,
    FaqCategoryService,
  ]
})
export class FaqModule {
}
