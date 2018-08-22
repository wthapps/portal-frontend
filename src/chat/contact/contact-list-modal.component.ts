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
      link: null,
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

  private destroy$ = new Subject();
  constructor(
    public apiBaseService: ApiBaseService,
    private chatContactService: ChatContactService,
    private modalService: ModalService,
    private conversationService: ConversationService,
    private chatCommonService: ChatCommonService,
    private authService: AuthService,
    private toastsService: ToastsService
  ) {}

  ngOnInit() {
    // this.usersOnlineItem$ = this.chatService.getUsersOnline();

    this.chatContactService.getAll().subscribe(response => {
      this.contacts = response.data;
    });

    this.apiBaseService
      .post('zone/chat/contact/contact_tab_count')
      .subscribe((res: any) => {
      });

    this.modalService.open$.pipe(takeUntil(this.destroy$)).subscribe(payload => {
      this.modal.open(payload);
    });
  }

  selectCurrentTab(tab: any) {
    this.loading = true;
    switch (tab.id) {

      case 'online':
        this.chatContactService.getAll().subscribe(response => {
          this.contacts = response.data.filter(contact => contact.online === true);
          this.loading = false;
        });
        break;

      case 'received':
        this.chatContactService.getAll().subscribe(response => {
          this.contacts = response.data;
          this.loading = false;
        });
        break;

      case 'blacklist':
        this.chatContactService.getAll().subscribe(response => {
          this.contacts = response.data;
          this.loading = false;
        });
        break;
      default:
        this.chatContactService.getAll().subscribe(response => {
          this.contacts = response.data;
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
          this.contacts = response.data;
          this.contacts.map(contact => contact.online = true);
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

      // update current contact list
      this.contacts.forEach((c: any, index: any) => {
        if (c.id === contact.id) {
          this.contacts[index].blacklist = !this.contacts[index].blacklist;
          const message = contact.blacklist ? `You added ${contact.name} to blacklist successful!` :
                                              `You removed ${contact.name} from blacklist successful!`;

          this.toastsService.success(message);
          return;
        }
      });
    });
  }

  report(contact: any) {

  }

  remove(contact: any) {
    const path = `chat/contacts/${contact.uuid}/remove`;
    this.apiBaseService.post(path)
      .pipe(takeUntil(this.destroy$)).subscribe(response => {

      // update current contact list
      this.contacts = response.data;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
