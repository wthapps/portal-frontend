import { Injectable } from '@angular/core';
import { ApiBaseService, StorageService } from '@shared/services';
import { CONVERSATION_SELECT } from '@shared/constant';
import { of } from 'rxjs';

@Injectable()
export class ChatMessageService {
  constructor(private apiBaseService: ApiBaseService, private storage: StorageService) {}

  create(groupId: any = null, data: any, option: any = {}) {
    // TODO this will be remvoe after getting groupId from UI
    const conversationId =
      groupId || this.storage.find(CONVERSATION_SELECT).value.group.id;

    return this.apiBaseService
      .post('zone/chat/message', { group_id: conversationId, data: data });
  }

  createTextMessage(message: any, option: any = {}) {
    const item = this.storage.find(CONVERSATION_SELECT);
    if (item && item.value && message) {
      return this.create(
        item.value.group.id,
        { message: message, type: 'text' },
        option
      );
    }
    return of({data: []});
  }
  createFileMessage(file: any) {
    return this.apiBaseService
      .post('zone/chat/message', {
        data: {
          type: 'file',
          id: file.object_id,
          object: file.object_type
        },
        group_id: this.storage.find(CONVERSATION_SELECT).value.group_id
      });
  }
  createMediaMessage(media: any) {
    return this.apiBaseService
      .post('zone/chat/message', {
        data: {
          type: 'file',
          id: media.id,
          object: media.object_type
        },
        group_id: this.storage.find(CONVERSATION_SELECT).value.group_id
      });
  }
}
