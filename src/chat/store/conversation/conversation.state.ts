import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Conversation } from './conversation.model';

export const conversationAdapter: EntityAdapter<Conversation> = createEntityAdapter<Conversation>({
  selectId: model => model.id
});

export interface ConversationState extends EntityState<Conversation> {
  selectedItem: Conversation | null;
  items: Array<Conversation> | [];
  isLoading?: boolean;
  error?: any;
}

export const INITIAL_CONVERSATION_STATE: ConversationState = conversationAdapter.getInitialState(
  {
    selectedItem: null,
    items: [],
    isLoading: false,
    error: null
  }
);
