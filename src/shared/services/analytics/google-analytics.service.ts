import { Injectable } from '@angular/core';

declare let ga: Function;

@Injectable()
export class GoogleAnalyticsService {
  constructor() {}

  public eventEmitter(eventCategory: string, eventAction: string, eventLabel: string = null, eventValue: number = null) {
    ga('send', 'event', {
      eventCategory, eventLabel, eventAction, eventValue
    });
  }
}
