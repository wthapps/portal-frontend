import { Observable } from 'rxjs';
import { CommonEvent } from './common-event';

export interface CommonEventHandler {
  event: Observable<CommonEvent>;
}
