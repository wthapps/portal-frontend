import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { WTab } from '@shared/components/w-nav-tab/w-nav-tab';
import { Constants } from '@shared/constant';
import { ChatService } from '@chat/shared/services/chat.service';
import { WthConfirmService } from '@shared/shared/components/confirmation/wth-confirm.service';
import { ApiBaseService, AuthService, ChatCommonService, CommonEventService, UserService } from '@shared/services';
import { MessageAssetsService } from '@chat/shared/message/assets/message-assets.service';
import { ZChatShareAddContactService } from '@chat/shared/modal/add-contact.service';
import { Observable } from 'rxjs/Observable';
import { Media } from '@shared/shared/models/media.model';
import { ResponseMetaData } from '@shared/shared/models/response-meta-data.model';
import { WObjectListService } from '@shared/components/w-object-list/w-object-list.service';
import { ConversationService } from '@chat/conversation/conversation.service';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'message-assets',
  templateUrl: 'message-assets.component.html',
  styleUrls: ['message-assets.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MessageAssetsComponent implements OnInit, OnDestroy {
  @Input() chatContactList: { [partner_id: string]: any } = {};
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
  nextLink: string;
  isLoading: boolean;
  members: Array<any> = [];
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
    private conversationService: ConversationService,
    private apiBaseService: ApiBaseService,
    private chatCommonService: ChatCommonService,
    private router: Router,
  ) {
    this.profileUrl = this.chatService.constant.profileUrl;
    this.messageAssetsService.open$.subscribe(
      (res: any) => {
        if (res) {
          this.open();
        }
      }
    );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  open() {
    this.chatService.getContactSelectAsync()
      .subscribe((res: any) => {
        this.conversation = res;
        if (this.conversation && this.conversation.group_type === 'couple') {
          this.tabs = this.tabsPhoto;
        } else {
          this.tabs = this.tabsMember;
        }
        this.tabAction(this.tabs[0]);
      });

    this.medias$ = this.messageAssetsService.medias$;
    this.objectListService.setMultipleSelection(false);
    this.addContactService.addMembers$.pipe(takeUntil(this.destroy$)).subscribe(users => {
      this.onAddMember(users);
    });
  }

  tabAction(event: WTab) {
    console.log(event);
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
      this.conversationService.getMembers(this.conversation.group_id, {}).subscribe(response => {
        this.members = response.data;
        this.isLoading = false;
      });
    }
  }

  onClose() {
    this.messageAssetsService.close();
  }

  onSelect(user: any) {
    this.chatService.selectContactByPartnerId(user.id);
  }

  onAddMember(members: Array<any>) {
    const body = { add_members: true, user_ids: members.map(user => user.id) };
    this.apiBaseService
      .put(`zone/chat/group/${this.conversation.group_id}`, body)
      .subscribe((res: any) => {
        // Update another conversations to update their status
        this.chatCommonService.updateConversationBroadcast(this.conversation.group_id).then((response: any) => {
          const conversation = response.data.own_group_user.group_json;
          this.members = conversation.users_json;
        });
      });
  }

  onRemoveMember(user: any) {
    this.chatService.removeFromConversation(this.conversation, user.id).then((response: any) => {
      const conversation = response.data.own_group_user.group_json;
      this.members = conversation.users_json;
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
        this.chatService.leaveConversation(this.conversation);
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
                parent_uuid: this.conversation.group.uuid,
                only_preview: true
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
        urlAPI = `chat/conversations/${this.conversation.group_json.uuid}/resources?qt=photo&per_page=${this.pageSize}`;
        break;
      case 'notes':
        urlAPI = `chat/conversations/${this.conversation.group_json.uuid}/resources?qt=note&per_page=${this.pageSize}`;
        break;
      default:
        urlAPI = `chat/conversations/${this.conversation.group_json.uuid}/resources?qt=file&per_page=${this.pageSize}`;
        break;
    }
    return urlAPI;
  }
}
