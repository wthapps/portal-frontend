import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { Subject, Subscription } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, switchMap, takeUntil, filter } from 'rxjs/operators';
import { BsModalComponent } from 'ng2-bs3-modal';

import { Constants } from '../../../../shared/constant';
import { ApiBaseService, ChatCommonService, CommonEventHandler, CommonEventService } from '../../../../shared/services';
import { ChatService } from '../../services/chat.service';
import { ChatContactService } from '../../services/chat-contact.service';
import { ChatConversationService } from '../../services/chat-conversation.service';
import { ContactSelectionService } from '@chat/shared/selections/contact/contact-selection.service';


const CONTACT_SELECTION = {
  ADD_MEMBER: 'ADD_MEMBER',
  SHARE_CONTACT: 'SHARE_CONTACT',
  NEW_CHAT: 'NEW_CHAT',
}

@Component({
  selector: 'w-contact-selection',
  templateUrl: 'contact-selection.component.html',
  styleUrls: ['contact-selection.component.scss']
})

export class ContactSelectionComponent extends CommonEventHandler implements OnInit {

  @ViewChild('modal') modal: BsModalComponent;

  contacts: any;
  type = CONTACT_SELECTION.ADD_MEMBER || CONTACT_SELECTION.NEW_CHAT || CONTACT_SELECTION.SHARE_CONTACT;
  title = 'Select Contacts' || 'New Chat' || 'Add Members';
  filter: any;
  loading = false;
  selectedUsers: Array<any> = [];
  suggestedUsers: Array<any> = [];
  channel = 'ZChatShareAddContactComponent';

  users: any = [];
  search$ = new Subject<string>();

  subscription: Subscription;
  searchSubscription: Subscription;


  readonly searchDebounceTime: number = Constants.searchDebounceTime;
  private DEFAULT_OPTIONS = {
    title: 'Select Contacts',
    path: '',
  };
  // private destroy$ = new Subject();

  constructor(
    private chatService: ChatService,
    private chatContactService: ChatContactService,
    private apiBaseService: ApiBaseService,
    private chatConversationService: ChatConversationService,
    private chatCommonService: ChatCommonService,
    public commonEventService: CommonEventService,
    private router: Router,
    private contactSelectionService: ContactSelectionService
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


    this.contactSelectionService.onOpen$.pipe(
      filter(options => options != null),
      takeUntil(this.destroy$)

    ).subscribe(options => {
      this.open(options);
    });
  }

  add() {
    if ([
      CONTACT_SELECTION.NEW_CHAT,
      CONTACT_SELECTION.SHARE_CONTACT,
      CONTACT_SELECTION.ADD_MEMBER,
    ].includes(this.type)) {
      this.contactSelectionService.select({
        eventName: this.type,
        payload: {
          data: this.selectedUsers
        }
      });

    }
    if (this.type === 'NEW_CHAT') {
      this.createConversation();
    }
    if (this.type === 'ADD_MEMBER') {
      this.addMember();
    }
    if (this.type === 'SHARE_CONTACT') {
    }
    this.modal.close();
  }

  open(options: any) {
    this.type = options.type || CONTACT_SELECTION.SHARE_CONTACT;
    this.title = options.title || 'Select Contacts';
    const path = options.path || `account/get_my_contacts_accounts?size=1000`;
    // {
    //   link = `zone/chat/group/${options.conversationSelected.group_id}/contacts_not_in_group`;


    this.loading = true;
    this.resetData();
    this.modal.open().then();

    this.apiBaseService.get(path).pipe(
      takeUntil(this.destroy$)
    ).subscribe(res => {
      this.contacts = res.data;
      this.users = res.data;
      this.loading = false;
    });
  }

  close() {
    this.modal.close().then();
    this.resetData();
    // this.destroy$.next();
    // this.destroy$.complete();
  }

  createConversation() {
    this.commonEventService.broadcast({
      channel: 'CONVERSATION_ACTIONS',
      action: 'createConversation',
      payload: {users: this.selectedUsers}
    });
    // this.chatContactService.addContact(this.selectedUsers.map(user => user.id)).then(res => {
    //   this.chatCommonService.updateConversationBroadcast(res.data.group_id).then(res2 => {
    //     this.chatConversationService.moveToFirst(res2.data);
    //   });
    //   this.chatConversationService.navigateToConversation(res.data.group_id);
    // });
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
      this.selectedUsers.push({ ...user, selected: true });
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
