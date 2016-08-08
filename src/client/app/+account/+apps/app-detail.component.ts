import {Component, AfterViewInit, OnInit, OnDestroy} from '@angular/core';
import {ROUTER_DIRECTIVES, ActivatedRoute} from '@angular/router';
import {Product} from '../../shared/models/product.model';
import {
  MenuItem,
  BreadcrumbComponent,
  AppCardCategoryComponent,
  AppCardPlatformComponent
} from '../../partials/index';

import {AppService} from './app.service';

declare var Swiper: any;
declare var swiperThumbs: any;

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

  item: Product = new Product;

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

  getProduct(id: number) {
    this.appService.get(`products/${id}`).subscribe(
      (res: any) => {
        this.item = res.data;
        this.breadcrumbs.push({label: res.data.display_name});
      },
      error => this.errorMessage = <any>error
    );
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
}
