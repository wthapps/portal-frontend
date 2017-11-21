import { Component, HostBinding } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'wth-footer',
  templateUrl: 'footer.component.html'
})
export class FooterComponent {
  @HostBinding('class.hidden') hideFooter:boolean = false;

  constructor(private router: Router) {
    this.router.events.subscribe((navigationEnd: NavigationEnd) => {
      this.checkUrls(navigationEnd.urlAfterRedirects ? navigationEnd.urlAfterRedirects : navigationEnd.url);
    });
  }

  checkUrls(url: string): void {
    // let urls = url.split('/');
    // if (urls.indexOf('zone') >= 0) {
    //   this.hideFooter = true;
    // } else {
    //   this.hideFooter = false;
    // }
  }
}

@Component({
  moduleId: module.id,
  selector: 'wth-footer-promotion',
  templateUrl: 'footer-promotion.component.html'
})
export class FooterPromotionComponent {
}
