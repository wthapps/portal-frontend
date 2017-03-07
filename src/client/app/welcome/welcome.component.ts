import { Component, AfterViewInit } from '@angular/core';

// declare var Swiper: any;

@Component({
  moduleId: module.id,
  templateUrl: 'welcome.component.html'
})

export class WelcomeComponent implements AfterViewInit {
  pageTitle: string = 'Welcome Page';

  ngAfterViewInit(): any {
    /* tslint:disable */
    // var swiper = new Swiper('.swiper-container', {
    //   pagination: '.swiper-pagination',
    //   paginationClickable: true,
    //   nextButton: '.swiper-button-next',
    //   prevButton: '.swiper-button-prev',
    // });
    /* tslint:enable */
  }
}
