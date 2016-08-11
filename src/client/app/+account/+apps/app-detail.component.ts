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
import { UserService } from '../../shared/index';

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
    AppService,
    UserService
  ]
})

export class AccountAppsDetailComponent implements AfterViewInit, OnInit, OnDestroy {
  pageTitle: string = '';
  errorMessage: string;

  item: Product = new Product();
  added: boolean = false;
  
  private app_id: number = 0;
  private sub: any;
  private breadcrumbs: MenuItem[];

  constructor(private route: ActivatedRoute,
              private appService: AppService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.breadcrumbs = [];
    this.breadcrumbs.push({label: 'Library', url: '/account/apps'});

    this.sub = this.route.params.subscribe(
      params => {        
        this.app_id = +params['id'];

        // verify this app_id is added or not    
        this.appService.get(`users/${this.userService.profile.id}/apps/${this.app_id}/check_added`)
          .subscribe((response: any) => {
            this.added = response.added;        
          },
          error => {
            this.errorMessage = <any>error
          }
        );

        this.getProduct(this.app_id);

    });



  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  getProduct(id: number) {
    this.appService.get(`apps/${id}`).subscribe(
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

  add(app_id: number): void{
    this.appService.add(`users/${this.userService.profile.id}/apps/${this.app_id}`).subscribe(
      (response: any) => {
        this.added = response.added;        
        // this.breadcrumbs.push({label: res.data.display_name});
      },
      error => this.errorMessage = <any>error
    );
  }
}
