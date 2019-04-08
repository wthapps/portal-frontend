import { Component, OnInit } from '@angular/core';

import { UserService } from '@shared/services';
import { ContactSelectionService } from './../shared/selections/contact/contact-selection.service';
import { Observable } from 'rxjs';

@Component({
  templateUrl: 'conversation-list.component.html'
})
export class ConversationListComponent implements OnInit {
  user$: Observable<any>;
  constructor(private userService: UserService, private contactSelectionService: ContactSelectionService) { }

  ngOnInit(): void {
    this.user$ = this.userService.profile$;
  }

  createChat() {
    this.contactSelectionService.open({
      type: 'NEW_CHAT'
    });
  }
}
