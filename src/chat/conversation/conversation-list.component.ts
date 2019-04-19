import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { UserEventService } from '@shared/user/event';


import { AppState } from '@chat/store';
import * as ConversationActions from '@chat/store/conversation/conversation.actions';
import { UserService } from '@shared/services';
import { ContactSelectionService } from './../shared/selections/contact/contact-selection.service';

@Component({
  templateUrl: 'conversation-list.component.html'
})
export class ConversationListComponent implements OnInit {
  user$: Observable<any>;
  constructor(
    private store$: Store<AppState>,
    private userService: UserService,
    private userEventService: UserEventService,
    private route: ActivatedRoute,
    private contactSelectionService: ContactSelectionService) {
      this.route.queryParamMap.subscribe(queryParams => {
        const user_id = queryParams.get('user_id');
        if (user_id) {
          // create convesation with above user
          this.userEventService.createChat({id: user_id});
        }
      });
    }

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
