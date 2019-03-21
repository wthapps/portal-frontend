import { Observable, Subject } from 'rxjs';
import { CommonEvent } from './common-event';
import { CommonEventService } from './common-event.service';
import { OnDestroy } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

export class CommonEventHandler implements OnDestroy {
  channel = 'CommonEventHandler';
  destroy$ = new Subject();
  constructor(public commonEventService: CommonEventService) {
    this.listen();
  }

  listen() {
    this.commonEventService
      .filter((event: CommonEvent) => event.channel === this.channel)
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: CommonEvent) => {
        this[event.action](event);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
