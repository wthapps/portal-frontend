import { Component, HostBinding, OnInit } from '@angular/core';
import { fadeInAnimation } from '../../shared/shared/animations/route.animation';
import { ScrollToConfigOptions, ScrollToService } from '@nicky-lenaers/ngx-scroll-to';

/**
 * This class represents the lazy loaded AboutComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-faq',
  templateUrl: 'faq.component.html',
  styleUrls: ['faq.component.scss'],
  animations: [fadeInAnimation]
})
export class FaqComponent implements OnInit {
  @HostBinding('@fadeInAnimation') fadeInAnimation = true;

  constructor(private scrollToService: ScrollToService) {

  }

  ngOnInit(): any {

  }

  onScrollTo(target) {

    const config: ScrollToConfigOptions = {
      target,
      offset: -50
    };

    this.scrollToService.scrollTo(config);
  }
}
