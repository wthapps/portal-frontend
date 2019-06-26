import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseEvent } from '@shared/base-event/base-event';
import { CONVERSATION_DELETE, CONVERSATION_EDIT, CONVERSATION_UPDATE } from '@chat/shared/conversation';

@Injectable()
export class ConversationEventService extends BaseEvent {
  constructor() {
    super();
  }

  edit(payload?: any) {
    this.broadcast(CONVERSATION_EDIT, payload);
  }

  get edit$(): Observable<any> {
    return this.on(CONVERSATION_EDIT);
  }

  update(payload?: any) {
    this.broadcast(CONVERSATION_UPDATE, payload);
  }

  get update$(): Observable<any> {
    return this.on(CONVERSATION_UPDATE);
  }

  delete(payload?: any) {
    this.broadcast(CONVERSATION_DELETE, payload);
  }

  get delete$(): Observable<any> {
    return this.on(CONVERSATION_DELETE);
  }
}
