import { Injectable } from '@angular/core';
import { Subject ,  Observable } from 'rxjs';
import { CommonEvent } from './common-event';
import { filter } from 'rxjs/operators';

/**
 * @service CommonEventService
 */


@Injectable()
export class CommonEventService {
  event: Observable<CommonEvent>;

  private eventSub: Subject<CommonEvent> = new Subject<CommonEvent>();
  // private subscription: Subscription;

  constructor() {
    this.event = this.eventSub.asObservable();
  }

  filter(func: any) {
    return this.event.pipe(filter(func));
  }

  subscribe(func: any) {
    return this.event.subscribe(func);
  }

  /**
   * Broadcast an event
   * @param  {CommonEvent} event information
   */
  broadcast(event: CommonEvent): void {
    this.eventSub.next(event);
  }

  /**
   * Listens an event and broadcasts it to the listeners.
   * @param  {CommonEvent} event information
   * @param  {any} listener Function to call when receiving an event
   */
  on(event: CommonEvent, listener: any): void {
    // this.subscription = this.event.subscribe((currentEvent: CommonEvent) => {
    //   // if(event.action === currentEvent.action) {
    //     listener(event);
    //   // }
    // });
    // this.subscription.unsubscribe();
  }
}
