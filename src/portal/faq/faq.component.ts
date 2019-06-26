import { Component, HostBinding, OnInit, ViewEncapsulation } from '@angular/core';
import { fadeInAnimation } from '../../shared/shared/animations/route.animation';
import { ScrollToConfigOptions, ScrollToService } from '@nicky-lenaers/ngx-scroll-to';
import { Observable } from 'rxjs';
import { FaqService } from '@portal/faq/faq.service';
import { FaqCategoryService } from '@portal/faq/faq-category.service';

/**
 * This class represents the lazy loaded AboutComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-faq',
  templateUrl: 'faq.component.html',
  styleUrls: ['faq.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [fadeInAnimation]
})
export class FaqComponent implements OnInit {
  @HostBinding('@fadeInAnimation') fadeInAnimation = true;

  categories$: Observable<Array<any>>;
  faq$: Observable<Array<any>>;
  constructor(private scrollToService: ScrollToService, private faqService: FaqService, private categoryService: FaqCategoryService) {
    this.categories$ = this.categoryService.categories$;
    this.faq$ = this.faqService.faqs$;
  }

  ngOnInit(): any {
    this.categoryService.getAll({});
    this.faqService.getAll({});
  }

  onScrollTo(target) {

    const config: ScrollToConfigOptions = {
      target,
      offset: -50
    };

    this.scrollToService.scrollTo(config);
  }
}
