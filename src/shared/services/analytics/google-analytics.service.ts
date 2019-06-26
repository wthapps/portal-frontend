import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

declare let ga: Function;

@Injectable()
export class GoogleAnalyticsService {
  constructor() {}

  public eventEmitter(eventCategory: string, eventAction: string, eventLabel: string = null, eventValue: number = null) {
    if (environment.production) {
      ga('send', 'event', {
        eventCategory, eventLabel, eventAction, eventValue
      });
    }
  }

  public sendPageView(url: string) {
    if (environment.production) {
      ga('set', 'page', url);
      ga('send', 'pageview');
    }
  }
}
