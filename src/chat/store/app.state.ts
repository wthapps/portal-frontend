import { ConversationState } from './conversation';
import { MessageState } from './message';

export interface AppState {
  conversation: ConversationState;
  message: MessageState;
}
