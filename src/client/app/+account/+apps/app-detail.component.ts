import {Component, AfterViewInit, OnInit, OnDestroy} from '@angular/core';
import {ROUTER_DIRECTIVES, Router, ActivatedRoute} from '@angular/router';

declare var Swiper: any;
declare var swiperThumbs: any;

import {Product} from '../../shared/models/product.model';
import {AppService} from './app.service';

import {
  MenuItem,
  BreadcrumbComponent,
  AppCardCategoryComponent,
  AppCardPlatformComponent
} from '../../partials/index';

import {AppService} from './app.service';

@Component({
  moduleId: module.id,
  templateUrl: 'app-detail.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    BreadcrumbComponent,
    AppCardCategoryComponent,
    AppCardPlatformComponent
  ],
  viewProviders: [
    AppService
  ]
})

export class AccountAppsDetailComponent implements AfterViewInit, OnInit, OnDestroy {
  pageTitle: string = '';
  errorMessage: string;

  item: Product = {
    id: 1,
    uuid: '',
    name: 'Featured New App & Service No 01',
    display_name: 'Featured New App & Service No 01',
    download_link: 'assets/images/apps/icon.png',
    description: 'Featured New App & Service No 01',
    img_src: 'assets/images/apps/icon.png',
    template_id: 1,
    template_path: '',
    product_categories_id: 1,
    active: true,
    router_link: '',
    platforms: ['windows', 'apple', 'browser']
  };

  private sub: any;
  private breadcrumbs: MenuItem[];

  constructor(private route: ActivatedRoute,
              private appService: AppService) {
  }

  ngOnInit() {
    this.breadcrumbs = [];
    this.breadcrumbs.push({label: 'Library', url: '/account/apps'});

    this.sub = this.route.params.subscribe(
      params => {
        let id = +params['id'];
        this.getProduct(id);
      });

  }

  ngOnDestroy() {
    this.sub.unsubscribe();
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
    });

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

  getProduct(id: number) {
    this.appService.get(`products/${id}`).subscribe(
      (res: any) => {
        console.log(res.data);
        this.item = res.data;
        this.breadcrumbs.push({label: res.data.display_name});
      },
      error => this.errorMessage = <any>error
    );
  }
}
