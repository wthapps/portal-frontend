import { Observable, Subject } from 'rxjs';
import { EventData } from '@core/base-event/event-data';
import { filter, map } from 'rxjs/operators';

export class BaseEvent {
  protected eventSubject: Subject<EventData>;

  constructor() {
    this.eventSubject = new Subject<EventData>();
  }

  protected broadcast(key: any, payload) {
    this.eventSubject.next({key: key, payload: payload});
  }

  protected on(key: any): Observable<any> {
    return this.eventSubject.asObservable().pipe(
      filter(event => event.key === key),
      map(event => event.payload)
    );
  }
}
