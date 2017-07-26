import { CommonEvent } from './common-event';
import { Subscription } from 'rxjs/Subscription';

/**
 * @interface CommonEventAction
 */
export interface CommonEventAction {
  commonEventSub: Subscription;
  doEvent(event: CommonEvent): void;
}
