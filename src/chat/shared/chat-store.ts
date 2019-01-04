import * as fromConversations from './../../core/store/chat/conversations.reducer';
import * as fromMessages from './../../core/store/chat/messages.reducer';
import * as fromChatNote from './../../core/store/chat/note.reducer';
import * as fromChatContext from './../../core/store/chat/context.reducer';

export const ChatStore = {
  conversations: fromConversations.reducer,
  messages: fromMessages.reducer,
  notes: fromChatNote.reducer,
  context: fromChatContext.reducer
};
