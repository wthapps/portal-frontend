import { CommonEvent } from './common-event';
import { Subscription } from 'rxjs';

/**
 * @interface CommonEventAction
 */
export interface CommonEventAction {
  doEvent(event: CommonEvent): void;
}
