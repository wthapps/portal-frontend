import { Observable } from 'rxjs/Observable';
import { CommonEvent } from './common-event';

export interface CommonEventHandler {
  event: Observable<CommonEvent>;
}
