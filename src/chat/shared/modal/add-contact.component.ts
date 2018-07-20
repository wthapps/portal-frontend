import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { BsModalComponent } from 'ng2-bs3-modal';

import { Constants } from '@shared/constant';
import { ApiBaseService } from '@shared/services';
import { ChatService } from '../services/chat.service';
import { ConversationService } from '@chat/conversation/conversation.service';

declare var _:any;

@Component({
  moduleId: module.id,
  selector: 'z-chat-share-add-contact',
  templateUrl: 'add-contact.component.html',
  styleUrls: ['contact-selection.component.scss']
})

export class ZChatShareAddContactComponent implements OnInit {

  @ViewChild('modal') modal: BsModalComponent;
  contacts: any;
  type = 'addContact';
  title = 'New Conversation';
  filter: any;
  conversationSelect: any;
  loading = false;
  selectedUsers: Array<any> = [];
  suggestedUsers: Array<any> = [];

  users: any = [];
  search$ = new Subject<string>();


  subscription: Subscription;
  searchSubscription: Subscription;
  readonly searchDebounceTime: number = Constants.searchDebounceTime;

  constructor(
    private chatService: ChatService,
    private apiBaseService: ApiBaseService,
    private conversationService: ConversationService
  ) {

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
    if(this.type == 'addContact') {
      this.addContact();
    }
    if(this.type == 'addMember') {
      this.addMember();
    }
    if(this.type == 'shareContact') {
      this.shareContact();
    }
  }

  open() {
    this.title = this.type === 'addContact' ? 'Create Conversation' :
                 this.type === 'addMember' ? 'Add Members' : 'Choose Contact';
    this.loading = true;
    this.resetData();
    this.modal.open().then();

    // this.chatService.getUserContacts().toPromise().then((res: any) => {
      this.apiBaseService.get(`account/get_my_contacts_accounts?size=1000`).subscribe(res => {

        this.contacts = res.data;
        this.users = res.data;
        this.loading = false;
      // if (this.title == 'Add To Conversation') {
      //   this.conversationSelect = this.chatService.getContactSelect().value;
      //   if (this.conversationSelect && this.conversationSelect.group_json.users_json) {
      //
      //     this.contacts = _.map(this.contacts, (contact: any) => {
      //       for (let user of this.conversationSelect.group_json.users_json) {
      //         contact.checked = false;
      //         contact.inConversation = false;
      //         if (contact.id === user.id) {
      //           contact.checked = true;
      //           contact.inConversation = true;
      //           break;
      //         }
      //       }
      //       return contact;
      //     });
      //   }
      // }
    });
  }

  close() {
    this.modal.close().then();
    this.resetData();
  }

  addContact() {
    let contacts = _.filter(this.contacts, { checked: true });
    let ids = _.map(contacts, 'id');
    this.chatService.chatContactService.addContact(ids);
    // this.chatService.createConversation(this.selectedUsers);
    this.close();
  }

  addMember() {
    let contacts = _.filter(_.filter(this.contacts, { checked: true}), {inConversation: false});
    let ids = _.map(contacts, 'id');
    this.chatService.addMembersGroup(ids);
    this.modal.close();
  }

  shareContact() {
    let contacts = _.filter(this.contacts, { checked: true });
    let ids = _.map(contacts, 'id');
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
