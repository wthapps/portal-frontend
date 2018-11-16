import { Observable } from 'rxjs';
import { CommonEvent } from './common-event';
import { CommonEventService } from './common-event.service';
import { OnDestroy } from '@angular/core';

export class CommonEventHandler implements OnDestroy {
  commonEventSub: any;
  constructor(public commonEventService: CommonEventService) {
    this.listen();
  }
  listen() {
    this.commonEventSub = this.commonEventService
      .filter((event: CommonEvent) => event.channel === this.constructor.name)
      .subscribe((event: CommonEvent) => {
        console.log(event);

        this[event.action](event.payload);
      });
  }

  ngOnDestroy() {
    if(this.commonEventSub) this.commonEventSub.unsubscribe();
  }
}
