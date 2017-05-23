import { PubSubEvent } from './pub-sub-event';
import { Subscription } from 'rxjs';

/**
 * @interface PubSubAction
 */
export interface PubSubAction {
  subscriptionPubSub: Subscription;
  doAction(event: PubSubEvent): void;
}
