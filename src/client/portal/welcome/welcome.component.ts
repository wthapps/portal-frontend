import { Component, AfterViewInit } from '@angular/core';

declare var $: any;

@Component({
  moduleId: module.id,
  templateUrl: 'welcome.component.html'
})

export class WelcomeComponent implements AfterViewInit {
  pageTitle: string = 'Welcome Page';

  ngAfterViewInit(): any {
    $('.welcome-slide-in').slick({
      dots: true,
      arrows: false
    });
  }
}
