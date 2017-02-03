import { Component, OnInit } from '@angular/core';

/**
 * This class represents the lazy loaded MyAccountComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-my-account',
  template: `redirecting...`
})
export class MyAccountComponent implements OnInit {
  ngOnInit() {
    window.location.href = 'http://google.com';
  }
}
