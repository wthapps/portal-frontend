import {Component, AfterViewInit} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

declare var Swiper: any;
declare var swiperThumbs: any;

import {
  IAppCard
} from '../../partials/index';

import {
  MenuItem,
  BreadcrumbComponent
} from '../../partials/index';

@Component({
  moduleId: module.id,
  templateUrl: 'app-detail.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    BreadcrumbComponent
  ]
})

export class AccountAppsDetailComponent implements AfterViewInit {
  pageTitle: string = '';

  item: IAppCard = {
    id: 1,
    img: 'assets/images/apps/icon.png',
    name: 'Featured New App & Service No 01',
    category: 'Product Category',
    flatform: ['windows', 'apple', 'browser']
  };
  private breadcrumbs: MenuItem[];

  ngOnInit() {
    this.breadcrumbs = [];
    this.breadcrumbs.push({label: 'Library', url: '/account/apps'});
    this.breadcrumbs.push({label: 'Random Top App Number 01'});
  }

  ngAfterViewInit(): any {
    /* tslint:disable */
    var mySwiper = new Swiper('.gallery-top', {
      // Example options
      //direction: 'vertical',
      nextButton: '.swiper-button-next',
      prevButton: '.swiper-button-prev',
      spaceBetween: 10,
      loop: true,
    })

    swiperThumbs(mySwiper, {
      // Our default options
      element: 'swiper-thumbnails',
      activeClass: 'active'
    });

    /*var galleryTop = new Swiper('.gallery-top', {
     nextButton: '.swiper-button-next',
     prevButton: '.swiper-button-prev',
     spaceBetween: 10,
     });
     var galleryThumbs = new Swiper('.gallery-thumbs', {
     spaceBetween: 10,
     slidesPerView: 4,
     slideToClickedSlide: true
     });
     galleryTop.params.control = galleryThumbs;
     galleryThumbs.params.control = galleryTop;*/
    /* tslint:enable */
  }
}
