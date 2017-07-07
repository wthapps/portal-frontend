import { CommonEvent } from './common-event';
import { Subscription } from 'rxjs';

/**
 * @interface CommonEventAction
 */
export interface CommonEventAction {
  commonEventSub: Subscription;
  doEvent(event: CommonEvent): void;
}
