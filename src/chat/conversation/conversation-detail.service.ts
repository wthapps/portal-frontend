import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ConversationDetailComponent } from '@chat/conversation/conversation-detail.component';
import { ApiBaseService, StorageService } from '@shared/services';
// import { Promise } from 'q';
import { CONVERSATION_SELECT } from '@shared/constant';

@Injectable()
export class ConversationDetailService {
  component: any;
  constructor(private apiBaseService: ApiBaseService, public storage: StorageService ) {}

  setComponent(component: ConversationDetailComponent) {
    this.component = component;
  }

  updateCurrentMessage() {
    // this.component
  }
}
