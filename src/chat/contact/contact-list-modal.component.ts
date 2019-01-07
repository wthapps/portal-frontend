import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ConversationService } from '@chat/conversation/conversation.service';
import { ChatContactService } from '@chat/shared/services/chat-contact.service';
import { ChatService } from '@chat/shared/services/chat.service';
import { ModalService } from '@shared/components/modal/modal-service';
import { ToastsService } from '@shared/shared/components/toast/toast-message.service';
import { Constants } from '@wth/shared/constant';

import { ApiBaseService, AuthService, ChatCommonService, CommonEventHandler, CommonEventService } from '@wth/shared/services';
import { BsModalComponent } from 'ng2-bs3-modal';
import { Subject, Subscription } from 'rxjs';
import { takeUntil, debounceTime, switchMap } from 'rxjs/operators';
import { ChatConversationService } from '@chat/shared/services/chat-conversation.service';

@Component({
  selector: 'contact-list-modal',
  templateUrl: 'contact-list-modal.component.html',
  styleUrls: ['contact-list-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ContactListModalComponent extends CommonEventHandler implements OnInit, OnDestroy {
  @ViewChild('modal') modal: BsModalComponent;

  contacts: any;
  currentContacts: Array<any>;
  channel = 'ContactListModalComponent';

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
    },
    {
      id: 'wthapps',
      name: 'WTHApps',
      link: null,
      icon: null,
      number: null
    }
  ];
  showSearch: boolean;
  keyword = '';
  loading: boolean;
  readonly tooltip = Constants.tooltip;
  readonly profileUrl = Constants.baseUrls.social + '/profile';
  selectedTab: string;
  keySearchSubject: Subject<string> = new Subject<string>();
  keySearchSubscription: Subscription;
  destroy$ = new Subject();

  constructor(
    public apiBaseService: ApiBaseService,
    private chatContactService: ChatContactService,
    private modalService: ModalService,
    private chatConversationService: ChatConversationService,
    private chatCommonService: ChatCommonService,
    public commonEventService: CommonEventService,
    private authService: AuthService,
    private toastsService: ToastsService,
    private chatService: ChatService
  ) {
    super(commonEventService);
  }

  ngOnInit() {
    this.modalService.open$.pipe(takeUntil(this.destroy$)).subscribe(payload => {
      this.modal.open(payload);
      this.selectedTab = payload.selectedTab || 'all';
      this.selectCurrentTab(this.selectedTab);
    });

    // Handle key search event
    this.keySearchSubscription = this.keySearchSubject.pipe(
      debounceTime(400),
      takeUntil(this.destroy$),
      switchMap(key => {
        this.keyword = key;
        this.loading = true;
        return this.apiBaseService.get(`chat/contacts/new/search?q=${key}`);
      })).subscribe(response => {
            this.mapResponseToContacts(response);
            this.loading = false;
      });
  }

  open(payload: any) {
    this.modal.open(payload);
    this.selectedTab = payload.selectedTab || 'all';
    this.showSearch = false;
    this.keyword = '';
    this.contacts = [];
    this.selectCurrentTab(this.selectedTab);
  }

  selectCurrentTab(tab: any) {
    this.loading = true;
    switch (tab.id) {

      case 'online':
        this.selectedTab = tab.id;
        this.apiBaseService.get(`account/users?category=my_contacts&online=true`)
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
        this.apiBaseService.get(`account/users?category=blacklist`)
          .pipe(takeUntil(this.destroy$)).subscribe(response => {
          this.mapResponseToContacts(response);
          this.loading = false;
        });
        break;
      case 'wthapps':
        this.displaySearch();
        this.loading = false;
        break;
      default:
        this.apiBaseService.get(`account/users?category=my_contacts`)
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
    this.keySearchSubject.next(event.search);
  }

  // actions

  createConversation(contact: any) {
    this.sendRequest(contact);
  }

  handleKeyUp(event) {
    this.keySearchSubject.next(event.search);
  }

  sendRequest(contact: any) {
    this.chatContactService.addContact([contact.id]).then(res => {
      this.chatCommonService.updateConversationBroadcast(res.data.group_id).then(res2 => {
        this.chatCommonService.moveFirstRecentList(res2.data.group_id);
      });
      this.chatConversationService.navigateToConversation(res.data.group_id);
    });
    this.modal.close();
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
          const message = newContact.blacklist ? `A contact has been blacklisted` :
                                                 `A contact has been removed from blacklist`;
          this.toastsService.success(message);
          return;
        }
      });
      this.chatService.getConversations({ forceFromApi: true});
    });
  }

  report(contact: any) {
    this.modalService.open({modalName: 'zoneReportModal'});
  }

  remove(contact: any) {
    const path = `chat/contacts/${contact.uuid}/remove`;
    this.apiBaseService.post(path)
      .pipe(takeUntil(this.destroy$)).subscribe(response => {
        this.contacts.forEach((con: any, index: number) => {
          if (con.id === contact.id) {
            this.contacts.splice(index, 1);
          }
        });
        this.toastsService.success(`You removed Contact ${contact.name} successful!`);
    });
  }

  close() {
    this.modal.close();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();

    console.log('check keySearchSubscription status: ', this.keySearchSubscription);
  }

  private mapResponseToContacts(response: any) {
    this.contacts = [];
    response.data.forEach(item => {
      this.contacts.push(item.attributes);
    });
  }
}
