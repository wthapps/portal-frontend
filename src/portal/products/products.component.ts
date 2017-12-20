import { Component, AfterViewChecked, HostBinding } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { fadeInAnimation } from '../../shared/shared/animations/route.animation';

/**
 * This class represents the lazy loaded ProductsComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-products',
  templateUrl: 'products.component.html',
  styleUrls: ['products.component.scss'],
  animations: [fadeInAnimation]
})

export class ProductsComponent implements AfterViewChecked {
  @HostBinding('@fadeInAnimation') fadeInAnimation = true;
  private scrollExecuted: boolean = false;

  constructor(private activatedRoute: ActivatedRoute) {
  }

  ngAfterViewChecked() {

    if (!this.scrollExecuted) {
      let routeFragmentSubscription: Subscription;

      // Automatic scroll
      routeFragmentSubscription =
        this.activatedRoute.fragment.subscribe(
          fragment => {
            if (fragment) {
              let element = document.getElementById(fragment);
              if (element) {
                element.scrollIntoView();

                this.scrollExecuted = true;

                // Free resources
                setTimeout(
                  () => {
                    console.log('routeFragmentSubscription unsubscribe');
                    routeFragmentSubscription.unsubscribe();
                  }, 1000);
              }
            }
          });
    }

  }
}
