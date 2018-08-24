import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { ApiBaseService, AuthService, ChatCommonService } from '@wth/shared/services';
import { ChatContactService } from '@chat/shared/services/chat-contact.service';
import { BsModalComponent } from 'ng2-bs3-modal';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ModalService } from '@shared/components/modal/modal-service';
import { Constants } from '@wth/shared/constant';
import { ConversationService } from '@chat/conversation/conversation.service';
import { ToastsService } from '@shared/shared/components/toast/toast-message.service';
import { ChatService } from '@chat/shared/services/chat.service';

@Component({
  selector: 'contact-list-modal',
  templateUrl: 'contact-list-modal.component.html',
  styleUrls: ['contact-list-modal.component.scss']
})
export class ContactListModalComponent implements OnInit, OnDestroy {
  @ViewChild('modal') modal: BsModalComponent;

  contacts: any;
  currentContacts: Array<any>;

  tabs: Array<any> = [
    {
      id: 'all',
      name: 'All Contacts',
      link: 'all',
      icon: null,
      number: null
    },
    {
      id: 'online',
      name: 'Online',
      link: null,
      icon: null,
      number: null
    },
    {
      id: 'received',
      name: 'Received',
      link: null,
      icon: null,
      number: null
    },
    {
      id: 'blacklist',
      name: 'Blacklist',
      link: null,
      icon: null,
      number: null
    }
  ];
  showSearch: boolean;
  keyword = '';
  loading: boolean;
  tooltip = Constants.tooltip;
  profileUrl = Constants.baseUrls.social + '/profile';
  selectedTab: string;

  private destroy$ = new Subject();
  constructor(
    public apiBaseService: ApiBaseService,
    private chatContactService: ChatContactService,
    private modalService: ModalService,
    private conversationService: ConversationService,
    private chatCommonService: ChatCommonService,
    private authService: AuthService,
    private toastsService: ToastsService,
    private chatService: ChatService
  ) {}

  ngOnInit() {
    this.modalService.open$.pipe(takeUntil(this.destroy$)).subscribe(payload => {
      this.modal.open(payload);
      this.selectedTab = payload.selectedTab || 'all';
      this.selectCurrentTab(this.selectedTab);
    });
  }

  selectCurrentTab(tab: any) {
    this.loading = true;
    switch (tab.id) {

      case 'online':
        this.selectedTab = tab.id;
        this.apiBaseService.get(`account/users/my_contacts/?online=true`)
          .pipe(takeUntil(this.destroy$)).subscribe(response => {
          this.mapResponseToContacts(response);
          this.loading = false;
        });

        break;

      case 'received':
        this.selectedTab = tab.id;
        this.chatContactService.getSentToMe().subscribe(response => {
          this.mapResponseToContacts(response);
          this.loading = false;
        });
        break;

      case 'blacklist':
        this.selectedTab = tab.id;
        this.apiBaseService.get(`account/users/blacklist`)
          .pipe(takeUntil(this.destroy$)).subscribe(response => {
          this.mapResponseToContacts(response);
          this.loading = false;
        });
        break;
      default:
        this.apiBaseService.get(`account/users/my_contacts`)
          .pipe(takeUntil(this.destroy$)).subscribe(response => {
          this.mapResponseToContacts(response);
          this.loading = false;
        });
        break;
    }
  }

  displaySearch() {
    this.showSearch = true;
    this.currentContacts = this.contacts;
    this.contacts = [];
  }

  hideSearch() {
    this.showSearch = false;
    this.contacts = this.currentContacts;
    this.currentContacts = [];
  }

  search(event: any) {
    this.keyword = event.search;
    this.loading = true;
    this.apiBaseService.get(`chat/contacts/new/search?q=${this.keyword}`)
        .pipe(takeUntil(this.destroy$)).subscribe(response => {
          this.mapResponseToContacts(response);
          this.loading = false;
    });

  }

  // actions

  createConversation(contact: any) {
    // this.conversationService.create([contact]).pipe(takeUntil(this.destroy$)).subscribe(response => {
    //   // jump to created conversation
    //   console.log('conversation created:::', response.data);
    //   // close current modal
    //   this.chatCommonService.updateConversationBroadcast(response.data.group_id);
    //   this.modal.close();
    // });
    this.chatContactService.addContact([contact.id]);
    this.modal.close();

  }

  sendRequest(contact: any) {
    this.modalService.open({modalName: 'ChatRequestModal', contact: contact});
  }

  toggleBlacklist(contact: any) {
    const path = `common/users/${this.authService.user.uuid}/blacklists/${contact.uuid}/${contact.blacklist ? 'remove' : 'add'}`;
    this.apiBaseService.get(path)
      .pipe(takeUntil(this.destroy$)).subscribe(response => {
      const newContact = response.data.attributes;
      // update current contact list
      this.contacts.forEach((con: any, index: any) => {
        if (con.id === newContact.id) {
          this.contacts[index] = newContact;
          const message = newContact.blacklist ? `You added ${newContact.name} to blacklist successful!` :
                                                 `You removed ${newContact.name} from blacklist successful!`;

          this.toastsService.success(message);
          return;
        }
      });
    });
  }

  report(contact: any) {
    this.modalService.open({modalName: 'zoneReportModal'});
  }

  remove(contact: any) {
    let path = `chat/contacts/${contact.uuid}/remove`;
    this.apiBaseService.post(path)
      .pipe(takeUntil(this.destroy$)).subscribe(response => {
        this.contacts = this.contacts.filter(con => con.id !== contact.id);
    });

    // remove conversation
    path = `chat/conversations/${contact.uuid}/remove`;
    this.apiBaseService.put(path)
      .pipe(takeUntil(this.destroy$)).subscribe(response => {
      // remove conversation from your view
      this.chatService.deleteContact(response.data);
      this.toastsService.success(`You removed Contact ${contact.name} successful!`);
    });
  }

  close() {
    this.modal.close();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private mapResponseToContacts(response: any) {
    this.contacts = [];
    response.data.forEach(item => {
      this.contacts.push(item.attributes);
    });
  }
}
