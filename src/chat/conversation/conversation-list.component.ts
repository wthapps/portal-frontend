import { Component, OnInit } from '@angular/core';

import { UserService } from '@shared/services';
import { ContactSelectionService } from './../shared/selections/contact/contact-selection.service';
import { Observable } from 'rxjs';
import * as ConversationActions from '@chat/store/conversation/conversation.actions';
import { Store } from '@ngrx/store';
import { AppState } from '@chat/store';

@Component({
  templateUrl: 'conversation-list.component.html'
})
export class ConversationListComponent implements OnInit {
  user$: Observable<any>;
  constructor(
    private store$: Store<AppState>,
    private userService: UserService,
    private contactSelectionService: ContactSelectionService) { }

  ngOnInit(): void {
    this.user$ = this.userService.profile$;
    // reset joined conversation
    this.store$.dispatch(new ConversationActions.SetState({joinedConversationId: null, joinedConversation: null}));
  }

  createChat() {
    this.contactSelectionService.open({
      type: 'NEW_CHAT'
    });
  }
}
