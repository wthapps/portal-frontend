import { Observable, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { EventData } from './event-data';

export class BaseEvent {
  private eventSubject: Subject<EventData>;

  constructor() {
    this.eventSubject = new Subject<EventData>();
  }

  protected broadcast(key: any, payload: any) {
    this.eventSubject.next({key: key, payload: payload});
  }

  protected on(key: any): Observable<any> {
    return this.eventSubject.asObservable().pipe(
      filter(event => event && event.key === key),
      map(event => event.payload)
    );
  }
}
