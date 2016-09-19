/**
 * <wth-slider [data]="images"></wth-slider>
 */

import {Component, AfterViewInit, Input, OnChanges} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

declare var Swiper: any;
declare var swiperThumbs: any;
/**
 * This class represents the AppCardSmComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'wth-slider',
  template: `
              <div class="article-slide-wrap">
                <div class="article-slide-in">
                  <div class="article-slide gallery-top">
                    <div class="swiper-wrapper">
                      <div class="swiper-slide" *ngFor="let img of images; let i = index">
                        <img [src]="imagesBg[i]" alt="{{i}}">
                      </div>
                    </div>
              
                    <!--<div class="swiper-button-next swiper-button-white"></div>
                    <div class="swiper-button-prev swiper-button-white"></div>-->
                  </div>
                  <div class="article-slide gallery-thumbs">
                    <div class="swiper-thumbnails">
                    <span *ngFor="let img of images; let ii = index">
                      <img [src]="imagesBg[ii]" alt="{{ii}}">
                    </span>
                    </div>
                  </div>
                </div>
              </div>
  `,
  directives: [ROUTER_DIRECTIVES]
})
export class SliderComponent implements OnChanges, AfterViewInit {
  @Input() data: Array<any>;

  images: Array<any> = [
    'assets/images/apps/slide.png',
    'assets/images/apps/slide.png',
    'assets/images/apps/slide.png',
    'assets/images/apps/slide.png',
    'assets/images/apps/slide.png'
  ];

  imagesBg: Array<any> = [
    'assets/images/apps/slide.png',
    'assets/images/apps/slide.png',
    'assets/images/apps/slide.png',
    'assets/images/apps/slide.png',
    'assets/images/apps/slide.png'
  ];

  ngAfterViewInit(): any {
    //mySwiper.destroy();
  }

  ngOnChanges(): void {
    if (this.data) {
      console.log(this.data);
      this.imagesBg = this.data;

      /* tslint:disable */
      var mySwiper = new Swiper('.gallery-top', {
        //nextButton: '.swiper-button-next',
        //prevButton: '.swiper-button-prev',
        spaceBetween: 10,
        loop: true,
      });

      swiperThumbs(mySwiper, {
        // Our default options
        element: 'swiper-thumbnails',
        activeClass: 'active'
      });
      /* tslint:enable */

    }

    //mySwiper.appendSlide('<div class="swiper-slide">Slide ' + (++appendNumber) + '</div>');


    /* tslint:disable */
    /*var mySwiper = new Swiper('.gallery-top', {
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
     });*/


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
