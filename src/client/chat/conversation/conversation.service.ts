import { Injectable } from '@angular/core';
import { ApiBaseService } from '../../core/shared/services/apibase.service';

@Injectable()
export class ConversationService {

  constructor(private api: ApiBaseService) {

  }

  deleteMessage(conversationId: number, id: number) {
    return this.api.delete(`/conversations${conversationId}/messages/${id}`);
  }

}
