import { Injectable } from '@angular/core';
import { UserService, ApiBaseService } from '@shared/services';
import { STORE_MESSAGES } from '@shared/constant';
import { of, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { CHAT_MESSAGES_CURRENT_SET, CHAT_MESSAGES_CURRENT_ADD, CHAT_MESSAGES_CURRENT_MORE,
  CHAT_MESSAGES_CURRENT_TIMEOUT } from '@core/store/chat/messages.reducer';
import { take, withLatestFrom, map } from 'rxjs/operators';
import { ChatConversationService } from './chat-conversation.service';
import { CHAT_CONVERSATIONS_SET } from '@core/store/chat/conversations.reducer';
import { v4 as uuid } from 'uuid';
import { Conversations } from '@shared/shared/models/chat/conversations.model';

@Injectable()
export class ChatMessageService {
  constructor(private api: ApiBaseService,
    private store: Store<any>,
    private userService: UserService,
    private chatConversationService: ChatConversationService) {}

  create(groupId: any = null, data: any) {
    return this.api
      .post('zone/chat/message', { group_id: groupId, data: data }).toPromise();
  }

  createTextMessage(message: any, option: any = {}) {
    of(message).pipe(withLatestFrom(this.chatConversationService.getStoreSelectedConversation()), map(([message, sc]) => {
      const id: any = uuid();
      const data: any = { status: 'pending', client_id: id, group_id: sc.group_id, message_type: 'text',
       message: message, user_id: this.userService.getSyncProfile().id };
      // add pending message
      this.addCurrentMessages({ message: data});
      setTimeout(() => {
        this.store.dispatch({ type: CHAT_MESSAGES_CURRENT_TIMEOUT, payload: data });
      }, 8000);
      this.create(sc.group_id, { message: message, type: 'text', client_id: id});
      return sc;
    })).toPromise().then(() => {
        // move first list
        this.chatConversationService.getStoreConversations().pipe(take(1)).subscribe((conversations: Conversations) => {
          this.chatConversationService.updateStoreConversations(conversations);
        });
      });
  }

  createFileMessage(file: any) {
    this.chatConversationService.getStoreSelectedConversation().pipe(take(1)).subscribe(sc => {
      if (sc) {
        this.api
          .post('zone/chat/message', {
            data: {
              type: 'file',
              id: file.object_id,
              object: file.object_type
            },
            group_id: sc.group_id
          }).subscribe(() => {
            });
      }
    });
  }
  createMediaMessage(media: any) {
    return of(media).pipe(withLatestFrom(this.chatConversationService.getStoreSelectedConversation()),
    map(([md, sc]) => {
      this.api
        .post('zone/chat/message', {
          data: {
            type: 'file',
            id: md.id,
            object: md.object_type
          },
          group_id: sc.group_id
        }).subscribe(() => {
          });
    }));
  }

  getMessages(groupId: number, options: any = {}): Promise<any> {
    return this.api.get('zone/chat/message/' + groupId, options).toPromise().then(res => {
      this.store.dispatch({type: CHAT_MESSAGES_CURRENT_SET, payload: res});
      return res;
    });
  }

  /**
   *
   * @param conversationId
   * @param id
   * Descritpion: calling delete message api, updating local data operation will be done later by
   * action cable handler later. Reference chat_actions.ts: chat_send_message handler
   */
  deleteMessage(conversationId: number, id: number): Observable<any> {
    return this.api.delete(
      `zone/chat/conversations/${conversationId}/messages/${id}`
    );
  }

  loadMoreMessages() {
    this.store.select(STORE_MESSAGES).pipe(take(1)).subscribe(s => {
      if (s.meta.links.next) {
        this.api.get(s.meta.links.next).toPromise().then(res => {
          this.store.dispatch({
            type: CHAT_MESSAGES_CURRENT_MORE, payload: {
              data: res.data,
              meta: res.meta
            }
          });
        });
      }
    });
  }

  getCurrentMessages(): Observable<any> {
    return this.store.select(STORE_MESSAGES);
  }

  addCurrentMessages(res: any) {
    of(res.message).pipe(withLatestFrom(this.chatConversationService.getStoreSelectedConversation()), map(([data, sc]) => {
      // update deleted and hide conversation to show, move to first
      this.chatConversationService.getStoreConversations().pipe(take(1)).subscribe((conversations: Conversations) => {
        conversations.data = conversations.data.map(c => {
          if (c.group_id === data.group_id && c.deleted) {
            c.deleted = false;
          }
          return c;
        });
        // move to first
        conversations.moveToFirstByGroupId(data.group_id);
        this.store.dispatch({
          type: CHAT_CONVERSATIONS_SET, payload: conversations
        });
      });

      // check current group chat and add message into
      if (data.group_id === sc.group_id) {
        this.store.dispatch({
          type: CHAT_MESSAGES_CURRENT_ADD, payload: {data: data}
        });
      }
    })).toPromise().then(() => {
      });
  }
}
