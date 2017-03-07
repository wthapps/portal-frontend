/**
 * <wth-slider [data]="images"></wth-slider>
 */

import { Component, AfterViewInit, Input, OnChanges, SimpleChanges } from '@angular/core';

declare var $: any;
/**
 * This class represents the AppCardSmComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'ac-apps-shared-slider',
  template: `
            <div class="article-slide-wrap">
              <div class="article-slide-in">
                <div class="slider slider-for">
                  <div class="swiper-slide" *ngFor="let img of images; let i = index">
                    <img [src]="imagesBg[i]" alt="{{i}}">
                  </div>
                </div>
                <div class="slider slider-nav">
                  <div *ngFor="let img of images; let ii = index">
                    <img [src]="imagesBg[ii]" alt="{{ii}}">
                  </div>
                </div>
              </div>
            </div>
  `
})
export class ACAppsSharedSliderComponent implements OnChanges, AfterViewInit {
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
    $('.slider-for').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      fade: true,
      asNavFor: '.slider-nav'
    });
    $('.slider-nav').slick({
      slidesToShow: 5,
      slidesToScroll: 1,
      asNavFor: '.slider-for',
      dots: false,
      arrows: false,
      centerMode: false,
      centerPadding: '0px',
      focusOnSelect: true
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.data) {
      this.imagesBg = this.data;
    }
  }
}
