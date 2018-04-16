import * as fromConversations from './../../core/store/chat/conversations.reducer';
import * as fromConversationsUsers from './../../core/store/chat/conversations_users.reducer';
import * as fromChatNote from './../../core/store/chat/note.reducer';

export const ChatStore = {
  conversations: fromConversations.reducer,
  conversationsUsers: fromConversationsUsers.reducer,
  notes: fromChatNote.reducer
};
