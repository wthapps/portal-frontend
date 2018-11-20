import { Observable } from 'rxjs';
import { CommonEvent } from './common-event';
import { CommonEventService } from './common-event.service';
import { OnDestroy } from '@angular/core';

export class CommonEventHandler implements OnDestroy {
  commonEventSub: any;
  channel: string = 'CommonEventHandler';
  constructor(public commonEventService: CommonEventService) {
    this.listen();
  }
  listen() {
    this.commonEventSub = this.commonEventService
      .filter((event: CommonEvent) => event.channel === this.channel)
      .subscribe((event: CommonEvent) => {
        this[event.action](event.payload);
      });
  }

  ngOnDestroy() {
    if(this.commonEventSub) this.commonEventSub.unsubscribe();
  }
}
