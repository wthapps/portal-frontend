import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { BsModalComponent } from 'ng2-bs3-modal';

import { Constants } from '@shared/constant';
import { ApiBaseService, ChatCommonService, CommonEventHandler, CommonEventService } from '@shared/services';
import { ChatService } from '../services/chat.service';
import { ConversationService } from '@chat/conversation/conversation.service';
import { ZChatShareAddContactService } from '@chat/shared/modal/add-contact.service';
import { ChatContactService } from '../services/chat-contact.service';
import { ChatConversationService } from '../services/chat-conversation.service';


declare var _: any;

@Component({
  selector: 'z-chat-share-add-contact',
  templateUrl: 'add-contact.component.html',
  styleUrls: ['contact-selection.component.scss']
})

export class ZChatShareAddContactComponent extends CommonEventHandler implements OnInit {

  @ViewChild('modal') modal: BsModalComponent;
  contacts: any;
  type = 'addContact';
  title = 'New Conversation';
  filter: any;
  conversationSelect: any;
  loading = false;
  selectedUsers: Array<any> = [];
  suggestedUsers: Array<any> = [];
  channel = 'ZChatShareAddContactComponent';

  users: any = [];
  search$ = new Subject<string>();

  subscription: Subscription;
  searchSubscription: Subscription;
  readonly searchDebounceTime: number = Constants.searchDebounceTime;

  constructor(
    private chatService: ChatService,
    private chatContactService: ChatContactService,
    private apiBaseService: ApiBaseService,
    private chatConversationService: ChatConversationService,
    private chatCommonService: ChatCommonService,
    public commonEventService: CommonEventService,
    private router: Router
  ) {
    super(commonEventService);
  }

  ngOnInit() {
    this.searchSubscription = this.search$.pipe(
      debounceTime(Constants.searchDebounceTime),
      distinctUntilChanged(),
      switchMap((searchEvent: any) => this.apiBaseService.get(`account/search?q=${searchEvent.query}`)))
      .subscribe((res: any) => {
          const selectedIds = this.selectedUsers.map(user => user.id);
          this.suggestedUsers = res.data.filter(user => !selectedIds.includes(user.id));
        },
        (error: any) => {
          console.log('error', error);
        }
      );
  }

  add() {
    if (this.type === 'addChat') {
      this.addContact();
    }
    if (this.type === 'addMember') {
      this.addMember();
    }
    if (this.type === 'shareContact') {
      this.shareContact();
    }
  }

  open(data: any) {
    const options: any = {
      addMember: {
        title: 'Add Members'
      },
      addChat: {
        title: 'New Chat'
      },
      shareContacts: {
        title: 'Choose Contact'
      },
    }
    Object.keys(options).forEach(key => {
      if(key == data.option) {
        this.title = options[key].title;
        this.type = key;
      }
    });
    this.loading = true;
    this.resetData();
    this.modal.open().then();

    this.apiBaseService.get(`account/get_my_contacts_accounts?size=1000`).subscribe(res => {
      this.contacts = res.data;
      this.users = res.data;
      this.loading = false;
    });
  }

  close() {
    this.modal.close().then();
    this.resetData();
  }

  addContact() {
    this.chatContactService.addContact(this.selectedUsers.map(user => user.id)).then(res => {
      this.chatCommonService.updateConversationBroadcast(res.data.group_id).then(res => {
        this.chatCommonService.moveFirstRecentList(res.data.group_id);
      });
      this.chatConversationService.navigateToConversation(res.data.group_id);
    });
    this.close();
  }

  addMember() {
    this.commonEventService.broadcast({
      channel: 'ChatConversationService',
      action: 'apiAddMembers',
      payload: this.selectedUsers
    })
    this.modal.close();
  }

  shareContact() {
    // const contacts = _.filter(this.contacts, { checked: true });
    // const ids = _.map(contacts, 'id');
    const ids = this.selectedUsers.map(u => u.id);
    this.chatService.shareContact(ids);
    this.modal.close();
  }

  search() {
    this.chatService.router.navigate([`${this.chatService.constant.searchNewContactsUrl}`]);
  }

  selectUser(user: any) {
    this.selectedUsers.forEach(u => {
      if (u.id === user.id) {
        u.selected = true;
        return;
      }
    });
    if (!this.selectedUsers.includes(user)) {
      this.selectedUsers.push({...user, selected: true});
    }
    this.contacts.forEach(u => {
      if (u.id === user.id) {
        u.selected = true;
        return;
      }
    });

  }

  deselectUser(user: any) {
    this.selectedUsers.forEach((u, index) => {
      if (u.id === user.id) {
        this.selectedUsers.splice(index, 1);
        return;
      }
    });

    this.contacts.forEach(u => {
      if (u.id === user.id) {
        u.selected = false;
        return;
      }
    });
  }

  toggleUserSelection(user: any) {
    if (user.selected) {
      this.deselectUser(user);
      user.selected = false;
    } else {
      this.selectUser(user);
      user.selected = true;
    }
  }

  resetData() {
    this.selectedUsers = [];
  }
}
