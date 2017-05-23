import { Observable } from 'rxjs';
import { PubSubEvent } from './pub-sub-event';

export interface PubSubEventHandler {
  event: Observable<PubSubEvent>;
}
