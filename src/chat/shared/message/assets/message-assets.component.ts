import { ChatMessageService } from './../../services/chat-message.service';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { filter, map, takeUntil, distinctUntilChanged, tap } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';

import { WTab } from '@shared/components/w-nav-tab/w-nav-tab';
import { Constants, STORE_CONVERSATIONS } from '@shared/constant';
import { ChatService } from '@chat/shared/services/chat.service';
import { WthConfirmService } from '@shared/shared/components/confirmation/wth-confirm.service';
import { ApiBaseService, AuthService, ChatCommonService, UserService } from '@shared/services';
import { MessageAssetsService } from '@chat/shared/message/assets/message-assets.service';

import { ResponseMetaData } from '@shared/shared/models/response-meta-data.model';
import { WObjectListService } from '@shared/components/w-object-list/w-object-list.service';
import { ChatConversationService } from '@chat/shared/services/chat-conversation.service';
import { ChatContactService } from '@chat/shared/services/chat-contact.service';
import { User } from '@shared/shared/models';
import { ContactSelectionService } from '@chat/shared/selections/contact/contact-selection.service';
import { AppState, ConversationActions } from '@chat/store';
import { MemberService } from '@chat/shared/services';
import { MessageActions } from '@chat/store/message';
import * as ConversationSelectors from '@chat/store/conversation/conversation.selectors';


@Component({
  selector: 'message-assets',
  templateUrl: 'message-assets.component.html',
  styleUrls: ['message-assets.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MessageAssetsComponent implements OnInit, OnDestroy {
  @Input() conversation: any;
  @Output() onViewProfile: EventEmitter<any> = new EventEmitter<any>();
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

  readonly validTypeMap = {
    'photos': ['Media::Photo', 'Media::Video'],
    'notes': ['Note::Note'],
    'files': ['Common::GenericFile']
  };


  tabsMember: WTab[] = [this.tabMember, ...this.tabsPhoto];
  tabs: WTab[] = [];

  currentTab: string; // members, photos, notes, files

  profileUrl: any;

  medias$: Observable<Array<any>>;
  medias: Array<any>;
  nextLink: string;
  isLoading: boolean;
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
    private messageAssetsService: MessageAssetsService,
    private objectListService: WObjectListService,
    private chatConversationService: ChatConversationService,
    private chatContactService: ChatContactService,
    private apiBaseService: ApiBaseService,
    private chatCommonService: ChatCommonService,
    private chatMessageService: ChatMessageService,
    private store: Store<any>,
    private router: Router,
    private contactSelectionService: ContactSelectionService,
    private store$: Store<AppState>,
    private memberService: MemberService,
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

    this.chatMessageService.getCurrentMessages().pipe(takeUntil(this.destroy$))
    .subscribe(({data, meta}) => {
      if (data && this.currentTab !== 'members') {
        const filteredData = data.filter(msg => msg.file && this.validTypeMap[this.currentTab].includes(msg.file_type) );

        this.messageAssetsService.mergeData(filteredData);
      }
    });
  }

  ngOnInit() {

    this.contactSelectionService.onSelect$.pipe(
      filter((event: any) => event.eventName === 'ADD_MEMBER'),
      map((event: any) => event.payload.data),
      takeUntil(this.destroy$)
    ).subscribe(payload => {
      this.addMembers(payload);
    });

    this.store$.pipe(
      select(ConversationSelectors.selectJoinedConversationId),
      filter(conversationId => conversationId !== null),
      takeUntil(this.destroy$)
    ).subscribe(conversationId => {
      this.messageAssetsService.close();
      }
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  open() {
    this.objectListService.setMultipleSelection(false);
    if (this.conversation && this.conversation.group_type === 'couple') {
      this.tabs = this.tabsPhoto;
    } else {
      this.tabs = this.tabsMember;
    }
    this.tabAction(this.tabs[0]);
  }

  tabAction(event: WTab) {
    this.currentTab = event.link;
    if (this.currentTab !== 'members') {
      this.loadMessagesByType(this.currentTab);
    } else {
      this.isLoading = true;
      this.apiBaseService.get('chat/conversations/' + this.conversation.uuid + '/members').pipe(
        takeUntil(this.destroy$)
      ).subscribe(res => {
        this.users = res.data;
      });
    }
  }

  onClickItem(item) {
    const { id } = item;
    this.selectedIds = { [id]: true };
  }

  delete(message: any) {
    this.store$.dispatch(new MessageActions.Delete({
      conversationId: this.conversation.uuid,
      message: message
    }));
    this.messageAssetsService.removeMedia(message);
  }

  viewProfile(user: any) {
    this.onViewProfile.emit(user);
  }

  onClose() {
    this.messageAssetsService.close();
  }

  createChat(user: any) {
    this.store$.dispatch(new ConversationActions.Create({users: [user]}));
  }

  addMembers(users: any) {
    this.memberService.add(this.conversation.uuid, {users: users}).pipe(
      takeUntil(this.destroy$),
    ).subscribe(response => {
      this.users.push(...response.data);
    });
  }

  removeMember(user: any) {
    this.memberService.remove(this.conversation.uuid, {user: user}).pipe(
      takeUntil(this.destroy$),
    ).subscribe(response => {
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
      // Download file
      default:
        window.open(item.file.url);
      break;
    }
  }

  download(item: any) {
    console.log('download:item:::', item);
  }

  loadMessagesByType(type: string) {
    this.isLoading = false;
    this.nextLink = this.buildNextLink();
    if (this.nextLink) {
      this.getObjects(true);
    } else {
      this.messageAssetsService.clear();
    }
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
