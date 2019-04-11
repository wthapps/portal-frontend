import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ChatContactService } from '@chat/shared/services/chat-contact.service';
import { ModalService } from '@shared/components/modal/modal-service';
import { ToastsService } from '@shared/shared/components/toast/toast-message.service';
import { Constants } from '@wth/shared/constant';

import { ApiBaseService, AuthService, ChatCommonService, CommonEventHandler, CommonEventService, CommonEvent } from '@wth/shared/services';
import { BsModalComponent } from 'ng2-bs3-modal';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ChatConversationService } from '@chat/shared/services/chat-conversation.service';
import { UserEventService } from '@shared/user/event';

@Component({
  selector: 'contact-list-modal',
  templateUrl: 'contact-list-modal.component.html',
  styleUrls: ['contact-list-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ContactListModalComponent extends CommonEventHandler implements OnInit, OnDestroy {
  @ViewChild('modal') modal: BsModalComponent;

  contacts: any;
  channel = 'ContactListModalComponent';
  noDataText = 'No contacts';

  tabs: Array<any> = [
    {
      id: 'all',
      name: 'My Contacts',
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
    }
  ];
  loading: boolean;
  readonly tooltip = Constants.tooltip;
  selectedTab: string;
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
    private userEventService: UserEventService
  ) {
    super(commonEventService);
  }

  ngOnInit() {
    this.modalService.open$.pipe(takeUntil(this.destroy$)).subscribe(payload => {
      this.modal.open(payload);
      this.selectedTab = payload.selectedTab || 'all';
      this.selectCurrentTab(this.selectedTab);
    });
  }

  open(event: CommonEvent) {
    this.selectedTab = event.payload.selectedTab || 'all';
    this.contacts = [];
    this.selectCurrentTab(this.selectedTab);
    this.modal.open(event.payload);
  }

  selectCurrentTab(tab: any) {
    this.loading = true;
    switch (tab.id) {

      case 'online':
        this.selectedTab = tab.id;
        this.noDataText = 'No online contacts';
        this.apiBaseService.get(`account/users?category=my_contacts&online=true`)
          .pipe(takeUntil(this.destroy$)).subscribe(response => {
            this.mapResponseToContacts(response);
            this.loading = false;
          });
        break;

      case 'received':
        this.selectedTab = tab.id;
        this.noDataText = 'No received contacts';
        this.chatContactService.getSentToMe().subscribe(response => {
          this.mapResponseToContacts(response);
          this.loading = false;
        });
        break;
      default:
        this.noDataText = 'No contacts';
        this.apiBaseService.get(`account/users?category=my_contacts`)
          .pipe(takeUntil(this.destroy$)).subscribe(response => {
            this.mapResponseToContacts(response);
            this.loading = false;
          });
        break;
    }
  }

  viewProfile(user: any) {
    this.userEventService.viewProfile(user);
  }

  createConversation(user: any) {
    this.userEventService.createChat(user);
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
        this.chatConversationService.apiGetConversations();
      });
  }

  report(contact: any) {
    this.modalService.open({ modalName: 'zoneReportModal' });
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
  }

  private mapResponseToContacts(response: any) {
    this.contacts = [];
    response.data.forEach(item => {
      this.contacts.push(item.attributes);
    });
  }
}
