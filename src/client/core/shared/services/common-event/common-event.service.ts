import { Injectable } from '@angular/core';
import { Subject, Subscription, Observable } from 'rxjs';
import { CommonEvent } from './common-event';
import { CommonEventHandler } from './common-event-handler';


/**
 * @service CommonEventService
 */


@Injectable()
export class CommonEventService implements CommonEventHandler {
  event: Observable<CommonEvent>;

  private eventSub: Subject<CommonEvent> = new Subject<CommonEvent>();
  // private subscription: Subscription;

  constructor() {
    this.event = this.eventSub.asObservable();
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
  // subscribe(callback: any): void {
  //   // this.subscription = this.event.subscribe((event: CommonEvent) => {
  //   //   callback(event);
  //   // });
  // }

  unsubscribe(): void {
    // this.subscription.unsubscribe();
  }

}
