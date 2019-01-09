import { Injectable } from '@angular/core';
import { ApiBaseService, StorageService } from '@shared/services';
import { CONVERSATION_SELECT, STORE_MESSAGES } from '@shared/constant';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { CHAT_MESSAGES_SET, CHAT_MESSAGES_CURRENT_SET, CHAT_MESSAGES_CURRENT_ADD, CHAT_MESSAGES_CURRENT_MORE } from '@core/store/chat/messages.reducer';
import { take, withLatestFrom, concatMap, map } from 'rxjs/operators';
import { ChatConversationService } from './chat-conversation.service';
import { CHAT_SELECTED_CONVERSATION_SET } from '@core/store/chat/selected-conversation.reducer';
import { CHAT_CONVERSATIONS_SET } from '@core/store/chat/conversations.reducer';

@Injectable()
export class ChatMessageService {
  constructor(private apiBaseService: ApiBaseService, private storage: StorageService, private store: Store<any>, private chatConversationService: ChatConversationService) {}

  create(groupId: any = null, data: any, option: any = {}) {
    return this.apiBaseService
      .post('zone/chat/message', { group_id: groupId, data: data }).toPromise();
  }

  createTextMessage(message: any, option: any = {}) {
    this.chatConversationService.getStoreSelectedConversation().pipe(take(1)).subscribe(sc => {
      if (sc) {
        this.create(
          sc.group_id,
          { message: message, type: 'text' },
          option
        ).then(res => {
          // handel in channel
        })
      }
    });
  }
  createFileMessage(file: any) {
    this.chatConversationService.getStoreSelectedConversation().pipe(take(1)).subscribe(sc => {
      if (sc) {
        this.apiBaseService
          .post('zone/chat/message', {
            data: {
              type: 'file',
              id: file.object_id,
              object: file.object_type
            },
            group_id: sc.group_id
          }).subscribe(res => {
              // handel in channel
          })
      }
    });
  }
  createMediaMessage(media: any) {
    return of(media).pipe(withLatestFrom(this.chatConversationService.getStoreSelectedConversation()), map(([media, sc]) => {
      this.apiBaseService
        .post('zone/chat/message', {
          data: {
            type: 'file',
            id: media.id,
            object: media.object_type
          },
          group_id: sc.group_id
        }).subscribe(res => {

        })
    }));
  }

  getMessages(groupId: number, options: any = {}): Promise<any> {
    return this.apiBaseService.get('zone/chat/message/' + groupId, options).toPromise().then(res => {
      this.store.dispatch({type: CHAT_MESSAGES_CURRENT_SET, payload: {
        data: res.data,
        meta: res.meta
      }})
      return res;
    })
  }

  loadMoreMessages(){
    this.store.select(STORE_MESSAGES).pipe(take(1)).subscribe(s => {
      this.apiBaseService.get(s.meta.links.next).toPromise().then(res => {
      this.store.dispatch({
        type: CHAT_MESSAGES_CURRENT_MORE, payload: {
          data: res.data,
          meta: res.meta
        }
      })
     })});
  }

  getCurrentMessages(){
    return this.store.select(STORE_MESSAGES)
  }

  addCurrentMessages(res: any){
    of(res).pipe(withLatestFrom(this.chatConversationService.getStoreSelectedConversation()), map(([data, sc]) => {
      // update deleted and hide conversation to show
      this.chatConversationService.getStoreConversations().pipe(take(1)).subscribe(conversations => {
        conversations.data = conversations.data.map(c => {
          if(c.group_id == data.group_id && c.deleted) {
            c.deleted = false;
          }
          return c;
        })
        this.store.dispatch({
          type: CHAT_CONVERSATIONS_SET, payload: conversations
        });
      });

      // check current group chat and add message into
      if (data.message.group_id == sc.group_id) {
        this.store.dispatch({
          type: CHAT_MESSAGES_CURRENT_ADD, payload: {data: data.message}
        });
      }
    })).toPromise().then(res => {

    })
  }
}
