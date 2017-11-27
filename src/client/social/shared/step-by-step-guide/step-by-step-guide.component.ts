import { Component, OnInit, AfterContentInit, ViewEncapsulation } from '@angular/core';

declare let Shepherd: any;

@Component({
  moduleId: module.id,
  selector: 'step-by-step-guide',
  templateUrl: 'step-by-step-guide.component.html',
  styleUrls: ['step-by-step-guide.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class StepByStepGuideComponent implements OnInit, AfterContentInit {
  constructor() {
  }

  ngOnInit() {
  }

  ngAfterContentInit(): void {
    let shepherd;
    shepherd = new Shepherd.Tour({
      defaults: {
        classes: 'shepherd-theme-arrows',
        showCancelLink: true
      }
    });
    shepherd.addStep('main-menu', {
      title: 'Main menu',
      text: 'Collection of available applications and tools in WTH!Zone. <br> Can switch between them easily.',
      attachTo: {element: '#menuleft-nav-intro-1', on: 'bottom right'},
      buttons: [
        {
          text: 'Skip all',
          classes: 'shepherd-close-text',
          action: shepherd.cancel
        }, {
          text: 'Next',
          action: shepherd.next,
          classes: 'btn btn-primary'
        }
      ]
    });
    shepherd.addStep('app-list', {
      title: 'App list',
      text: 'Allow you to quickly switch between WTH!App services.',
      attachTo: {element: '.header-nav-apps', on: 'bottom left'},
      buttons: [
        {
          text: 'Skip all',
          classes: 'shepherd-close-text',
          action: shepherd.cancel
        }, {
          text: 'Back',
          action: shepherd.back,
          classes: 'btn btn-outline-default'
        }, {
          text: 'Next',
          action: shepherd.next,
          classes: 'btn btn-primary'
        }
      ]
    });

    shepherd.start();
  }
}
