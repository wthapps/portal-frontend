import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { Subject, Subscription } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, switchMap, takeUntil, filter } from 'rxjs/operators';
import { BsModalComponent } from 'ng2-bs3-modal';

import { Constants } from '../../../../shared/constant';
import { ApiBaseService } from '../../../../shared/services';
import { ContactSelectionService } from '@chat/shared/selections/contact/contact-selection.service';


const CONTACT_SELECTION = {
  ADD_MEMBER: 'ADD_MEMBER',
  SHARE_CONTACT: 'SHARE_CONTACT',
  NEW_CHAT: 'NEW_CHAT',
};

@Component({
  selector: 'w-contact-selection',
  templateUrl: 'contact-selection.component.html',
  styleUrls: ['contact-selection.component.scss']
})

export class ContactSelectionComponent implements OnInit {

  @ViewChild('modal') modal: BsModalComponent;

  contacts: any;
  type = CONTACT_SELECTION.ADD_MEMBER || CONTACT_SELECTION.NEW_CHAT || CONTACT_SELECTION.SHARE_CONTACT;
  title = 'Select Contacts' || 'New Chat' || 'Add Members';
  filter: any;
  loading = false;
  selectedUsers: Array<any> = [];
  suggestedUsers: Array<any> = [];

  users: any = [];
  search$ = new Subject<string>();

  subscription: Subscription;
  searchSubscription: Subscription;


  readonly searchDebounceTime: number = Constants.searchDebounceTime;
  private destroy$ = new Subject();
  private DEFAULT_OPTIONS = {
    title: 'Select Contacts',
    path: '',
  };
  // private destroy$ = new Subject();

  constructor(
    private apiBaseService: ApiBaseService,
    private contactSelectionService: ContactSelectionService
  ) {
  }

  ngOnInit() {
    this.searchSubscription = this.search$.pipe(
      debounceTime(Constants.searchDebounceTime),
      distinctUntilChanged(),
      switchMap((searchEvent: any) => this.apiBaseService.get(`account/search?q=${searchEvent.query}`)))
      .subscribe((res: any) => {
        if (!this.selectedUsers) {
          this.resetData();
        }
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
