import { CommonEvent } from './common-event';
import { Subscription } from 'rxjs/Subscription';

/**
 * @interface CommonEventAction
 */
export interface CommonEventAction {
  doEvent(event: CommonEvent): void;
}
