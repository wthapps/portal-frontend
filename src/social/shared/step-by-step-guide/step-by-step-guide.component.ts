import { Component, OnInit, AfterContentInit, ViewEncapsulation } from '@angular/core';

declare let Shepherd: any;

@Component({
  moduleId: module.id,
  selector: 'step-by-step-guide',
  templateUrl: 'step-by-step-guide.component.html',
  styleUrls: ['step-by-step-guide.component.scss'],
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
        classes: 'shepherd-element shepherd-open shepherd-theme-arrows',
        showCancelLink: false
      }
    });
    shepherd.addStep('main-menu', {
      title: 'Main menu',
      text: 'Collection of available applications and tools in WTH!Zone. <br> Can switch between them easily.',
      attachTo: {element: '#menuleft-nav-intro-1', on: 'right'},
      classes: 'shepherd shepherd-open shepherd-theme-arrows shepherd-transparent-text',
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
      attachTo: {element: '.header-nav-apps', on: 'bottom right'},
      buttons: [
        {
          text: 'Skip all',
          classes: 'shepherd-close-text',
          action: shepherd.cancel
        }, {
          text: 'Previous',
          action: shepherd.back,
          classes: 'btn btn-outline-default'
        }, {
          text: 'Next',
          action: shepherd.next,
          classes: 'btn btn-primary'
        }
      ]
    });

    shepherd.addStep('header-nav-notification', {
      title: 'Notification',
      text: 'Recieve apps and service notification or request from other users.',
      attachTo: {element: '.header-nav-notification.hidden-xs', on: 'bottom right'},
      buttons: [
        {
          text: 'Skip all',
          classes: 'shepherd-close-text',
          action: shepherd.cancel
        }, {
          text: 'Previous',
          action: shepherd.back,
          classes: 'btn btn-outline-default'
        }, {
          text: 'Next',
          action: shepherd.next,
          classes: 'btn btn-primary'
        }
      ]
    });
    shepherd.addStep('account-preferences', {
      title: 'Account preferences',
      text: 'Edit your privacy information, personal references and subscription.',
      attachTo: {element: '.header-nav-profile', on: 'bottom right'},
      buttons: [
        {
          text: 'Skip all',
          classes: 'shepherd-close-text',
          action: shepherd.cancel
        }, {
          text: 'Previous',
          action: shepherd.back,
          classes: 'btn btn-outline-default'
        }, {
          text: 'Complete',
          action: shepherd.cancel,
          classes: 'btn btn-primary'
        }
      ]
    });

    shepherd.start();
  }
}
