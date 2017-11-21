import { Component, AfterViewInit } from '@angular/core';

declare var $: any;
declare var Shepherd: any;

@Component({
  moduleId: module.id,
  selector: 'page-welcome-done',
  templateUrl: 'done.component.html',
  styleUrls: ['done.component.css']
})

export class WelcomeDoneComponent implements AfterViewInit {
  pageTitle: string = 'Welcome Page';

  ngAfterViewInit() {

  }

  // ngAfterViewInit(): any {
  //   $('.welcome-slide-in').slick({
  //     dots: true,
  //     arrows: false
  //   });
  //
  //   let tour = new Shepherd.Tour({
  //     defaults: {
  //       classes: 'shepherd-theme-arrows'
  //     }
  //   });
  //
  //   tour.addStep('example', {
  //     title: 'Example Shepherd',
  //     text: 'Creating a Shepherd is easy too! Just create ...',
  //     attachTo: '.header-nav-apps bottom',
  //     advanceOn: '.docs-link click'
  //   });
  //
  //   tour.start();
  // }
}
