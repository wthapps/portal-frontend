import {Component, AfterViewInit} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

declare var Swiper:any;

@Component({
  moduleId: module.id,
  templateUrl: 'welcome.component.html',
  directives: [
    ROUTER_DIRECTIVES
  ]
})

export class WelcomeComponent implements AfterViewInit {
  pageTitle:string = 'Welcome Page';

  ngAfterViewInit():any {
    var swiper = new Swiper('.swiper-container', {
      pagination: '.swiper-pagination',
      paginationClickable: true,
      nextButton: '.swiper-button-next',
      prevButton: '.swiper-button-prev',
    });
  }
}
