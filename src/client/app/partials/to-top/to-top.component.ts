/**
 * <wth-to-top></wth-to-top>
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

declare var $: any;
/**
 * This class represents the AppCardSmComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'wth-to-top',
  template: '',
  styles: ['.to-top { display: none; }']
})
export class ToTopComponent implements OnInit, OnDestroy {

  constructor(private router: Router) {
  }

  ngOnInit() {

    if (!$('.to-top').length) {
      $('.footer').append('<div class="to-top"><a href="javascript:;" class="x-to-top" (click)="toTop($event)"><i class="fa fa-arrow-up"></i></a></div>');
      var scrollTrigger = 100, // px
        backToTop = ()=> {
          var scrollTop = $(window).scrollTop();
          if (scrollTop > scrollTrigger) {
            $('.to-top').fadeIn();
          } else {
            $('.to-top').fadeOut();
          }
        };
      backToTop();
      $(window).on('scroll', ()=> {
        backToTop();
      });

      $('body').on('click', '.x-to-top', (e)=> {
        e.preventDefault();
        $('html, body').animate({
          scrollTop: 0
        }, 1000);
      })
    }

    this.router.events.subscribe()

  }

  ngOnDestroy() {
    $('.to-top').remove();
  }

}
