import { Injectable } from '@angular/core';
import { Subject, Subscription, Observable } from 'rxjs';
import { PubSubEvent } from './pub-sub-event';
import { PubSubEventHandler } from './pub-sub-event-handler';


/**
 * @service PubSubEventService
 */

@Injectable()
export class PubSubEventService implements PubSubEventHandler {
  event: Observable<PubSubEvent>;

  private eventSub: Subject<PubSubEvent> = new Subject<PubSubEvent>();;
  // private subscription: Subscription;

  constructor() {
    this.event = this.eventSub.asObservable();
  }

  addEvent(event: PubSubEvent): void {
    this.eventSub.next(event);
  }

  subscribe(callback: any): void {
    // this.subscription = this.event.subscribe((event: PubSubEvent) => {
    //   callback(event);
    // });
  }

  unsubscribe(): void {
    // this.subscription.unsubscribe();
  }

}
