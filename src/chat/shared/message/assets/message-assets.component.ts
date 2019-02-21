import { ChatMessageService } from './../../services/chat-message.service';
import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { takeUntil, distinctUntilChanged, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { WTab } from '@shared/components/w-nav-tab/w-nav-tab';
import { Constants, STORE_CONVERSATIONS } from '@shared/constant';
import { ChatService } from '@chat/shared/services/chat.service';
import { WthConfirmService } from '@shared/shared/components/confirmation/wth-confirm.service';
import { ApiBaseService, AuthService, ChatCommonService, UserService } from '@shared/services';
import { MessageAssetsService } from '@chat/shared/message/assets/message-assets.service';
import { ZChatShareAddContactService } from '@chat/shared/modal/add-contact.service';

import { ResponseMetaData } from '@shared/shared/models/response-meta-data.model';
import { WObjectListService } from '@shared/components/w-object-list/w-object-list.service';
import { ChatConversationService } from '@chat/shared/services/chat-conversation.service';
import { ChatContactService } from '@chat/shared/services/chat-contact.service';
import { User } from '@shared/shared/models';


@Component({
  selector: 'message-assets',
  templateUrl: 'message-assets.component.html',
  styleUrls: ['message-assets.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MessageAssetsComponent implements OnInit, OnDestroy {
  conversation: any;
  tooltip: any = Constants.tooltip;

  tabMember: WTab = {
    name: 'Members',
    link: 'members',
    icon: null,
    number: null,
    type: 'tab'
  };
  tabsPhoto: WTab[] = [
    {
      name: 'Photos',
      link: 'photos',
      icon: null,
      number: null,
      type: 'tab'
    },
    {
      name: 'Notes',
      link: 'notes',
      icon: null,
      number: null,
      type: 'tab'
    },
    {
      name: 'Files',
      link: 'files',
      icon: null,
      number: null,
      type: 'tab'
    }
  ];


  tabsMember: WTab[] = [this.tabMember, ...this.tabsPhoto];
  tabs: WTab[] = [];

  currentTab: string; // members, photos, notes, files

  profileUrl: any;

  medias$: Observable<Array<any>>;
  medias: Array<any>;
  nextLink: string;
  isLoading: boolean;
  conversations$: any;
  users: any = [];
  selectedIds = {};
  currentUser: User;
  readonly noteUrl: any = `${Constants.baseUrls.note}/notes/public`;
  private destroy$ = new Subject<any>();
  private pageSize = 30;

  constructor(
    private chatService: ChatService,
    public userService: UserService,
    public authService: AuthService,
    private wthConfirmService: WthConfirmService,
    private addContactService: ZChatShareAddContactService,
    private messageAssetsService: MessageAssetsService,
    private objectListService: WObjectListService,
    private chatConversationService: ChatConversationService,
    private chatContactService: ChatContactService,
    private apiBaseService: ApiBaseService,
    private chatCommonService: ChatCommonService,
    private chatMessageService: ChatMessageService,
    private store: Store<any>,
    private router: Router,
  ) {
    this.profileUrl = this.chatService.constant.profileUrl;
    this.currentUser = userService.getSyncProfile();
    this.messageAssetsService.open$.subscribe(
      (res: any) => {
        if (res) {
          this.open();
        }
      }
    );
    this.messageAssetsService.medias$.pipe(
      takeUntil(this.destroy$))
    .subscribe(media => this.medias = media);

    this.chatConversationService.getStoreSelectedConversation().pipe(
      distinctUntilChanged((p, q) => p.id === q.id),
      takeUntil(this.destroy$)
    ).subscribe(sc => {
      this.conversation = sc;
      if (this.conversation && this.conversation.group_type === 'couple') {
        this.tabs = this.tabsPhoto;
      } else {
        this.tabs = this.tabsMember;
      }
      this.tabAction(this.tabs[0]);
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  open() {
    this.objectListService.setMultipleSelection(false);
  }

  tabAction(event: WTab) {
    this.currentTab = event.link;
    if (this.currentTab !== 'members') {
      this.isLoading = false;
      this.nextLink = this.buildNextLink();
      if (this.nextLink) {
        this.getObjects(true);
      } else {
        this.messageAssetsService.clear();
      }
    } else {
      this.isLoading = true;
      // this.conversations$ = this.store.select(STORE_CONVERSATIONS);
      this.apiBaseService.get('zone/chat/group/' + this.conversation.group_id + '/users').subscribe(res => {
        this.users = res.data;
      });
    }
  }

  onClickItem(item) {
    const { id } = item;
    this.selectedIds = { [id]: true };
  }

  onRemove(item) {
    const { group_id, id} = item;
    this.chatMessageService.deleteMessage(group_id, id).toPromise()
    .then(() => {
      this.messageAssetsService.removeMedia(item);
    });
  }

  viewProfile() {
    console.log('View profile ...');
  }

  onClose() {
    this.messageAssetsService.close();
  }

  onSelect(user: any) {
    this.chatContactService.addContact([user.id]).then(res => {
      this.chatCommonService.updateConversationBroadcast(res.data.group_id).then(res2 => {
        this.chatConversationService.moveToFirst(res2.data);
      });
      this.chatConversationService.navigateToConversation(res.data.group_id);
    });
  }

  onRemoveMember(user: any) {
    this.chatConversationService.removeFromConversation(this.conversation, user.id).then((response: any) => {
      console.log(response);
      this.users = this.users.filter(u => u.id !== user.id);
    });
  }

  onAddToBlackList(user: any) {
    this.wthConfirmService.confirm({
      message: 'Are you sure you want to add this contact to black list ?',
      header: 'Add To Black List',
      accept: () => {
        this.chatService.addGroupUserBlackList(user.id);
      }
    });
  }

  leaveConversation(user: any) {
    this.wthConfirmService.confirm({
      message: 'Are you sure you want to leave this conversation?',
      header: 'Leave Conversation',
      accept: () => {
        this.chatConversationService.leaveConversation(this.conversation);
      }
    });
  }

  getObjects(override?: boolean) {
    if (this.nextLink && !this.isLoading) {
      this.isLoading = true;
      this.messageAssetsService.getMedias(this.nextLink, override).subscribe(
        (res: ResponseMetaData) => {
          this.nextLink = res.meta.links.next;
          this.isLoading = false;
        }
      );
    }
  }

  onCompleteLoadMore(event: boolean) {
    if (event && this.nextLink !== null) {
      this.isLoading = true;
      this.messageAssetsService.getMedias(this.nextLink, false).pipe(takeUntil(this.destroy$)).subscribe(
        (res: ResponseMetaData) => {
          this.nextLink = res.meta.links.next;
          this.isLoading = false;
        }
      );
    }
  }

  onCompleteSort(event: any) {
    if (event) {
      this.nextLink = this.buildNextLink() + `&sort=${event.sortOrder}&sort_name=${event.sortBy}`;
      this.messageAssetsService.clear();
      this.getObjects();
    }
  }

  onCompleteDoubleClick(event: any) {
    console.log('show photo, note, file:', event); // show photo, note, file
  }

  view(item: any) {
    switch (item.file_type) {
      case 'Media::Photo':
      case 'Media::Video':
        this.router.navigate([{
          outlets: {
            modal: [
              'preview',
              item.file.uuid,
              {
                object: 'conversation',
                parent_uuid: this.conversation.uuid,
                only_preview: false
              }
            ]
          }
        }], { queryParamsHandling: 'preserve', preserveFragment: true });
        break;
      case 'Note::Note':
        window.open(`${this.noteUrl}/${item.uuid}`);
        break;
    }
  }

  download(item: any) {
    console.log('download:item:::', item);
  }

  private buildNextLink() {
    let urlAPI = '';
    switch (this.currentTab) {
      case 'photos':
        urlAPI = `chat/conversations/${this.conversation.uuid}/resources?qt=photo&per_page=${this.pageSize}`;
        break;
      case 'notes':
        urlAPI = `chat/conversations/${this.conversation.uuid}/resources?qt=note&per_page=${this.pageSize}`;
        break;
      default:
        urlAPI = `chat/conversations/${this.conversation.uuid}/resources?qt=file&per_page=${this.pageSize}`;
        break;
    }
    return urlAPI;
  }
}
