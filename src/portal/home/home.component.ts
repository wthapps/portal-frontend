import { Component, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { HandleReCaptchaMixin } from '@portal/shared/mixins/handle-login-recaptcha.mixin';
import { Mixins } from '@shared/design-patterns/decorator/mixin-decorator';
import { Constants } from '../../shared/constant/config/constants';

import { fadeInAnimation } from '../../shared/shared/animations/route.animation';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss'],
  animations: [fadeInAnimation]
})
@Mixins([HandleReCaptchaMixin])
export class HomeComponent {
  @HostBinding('@fadeInAnimation') fadeInAnimation = true;

  tooltip: any = Constants.tooltip;

  constructor(
    private router: Router
  ) {
  }

  gotoHashtag(link: string, prodID: string) {
    this.router
      .navigate([`${link}`], { fragment: prodID, preserveFragment: true })
      .then(() => this.jump(prodID));
    return false;
  }

  jump(h) {
    const top = document.getElementById(h).offsetTop;
    window.scrollTo(0, top);
  }
}
