import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { WTab } from '@shared/components/w-nav-tab/w-nav-tab';
import { Constants } from '@shared/constant';
import { ChatService } from '@chat/shared/services/chat.service';
import { WthConfirmService } from '@shared/shared/components/confirmation/wth-confirm.service';
import { ApiBaseService, ChatCommonService, CommonEventService, UserService } from '@shared/services';
import { MessageAssetsService } from '@chat/shared/message/assets/message-assets.service';
import { ZChatShareAddContactService } from '@chat/shared/modal/add-contact.service';
import { Observable } from 'rxjs/Observable';
import { Media } from '@shared/shared/models/media.model';
import { ResponseMetaData } from '@shared/shared/models/response-meta-data.model';
import { WObjectListService } from '@shared/components/w-object-list/w-object-list.service';
import { ConversationService } from '@chat/conversation/conversation.service';
import { Subject } from 'rxjs';
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

  medias$: Observable<Media[]>;
  nextLink: string;
  isLoading: boolean;
  members: Array<any> = [];
  private destroy$ = new Subject<any>();

  constructor(
    private chatService: ChatService,
    private commonEventService: CommonEventService,
    private userService: UserService,
    private wthConfirmService: WthConfirmService,
    private addContactService: ZChatShareAddContactService,
    private messageAssetsService: MessageAssetsService,
    private objectListService: WObjectListService,
    private conversationService: ConversationService,
    private apiBaseService: ApiBaseService,
    private chatCommonService: ChatCommonService
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
      message: 'Are you sure you want to left this conversation?',
      header: 'Leave Conversation',
      accept: () => {
        this.conversationService.leave(user.id);
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
    if (event) {
      this.getObjects();
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

  private buildNextLink() {
    let urlAPI = '';
    switch (this.currentTab) {
      case 'photos':
        urlAPI = `media/photos?active=1`;
        break;
      case 'notes':
        urlAPI = `note/v1/mixed_entities?active=1`;
        break;
      default:
        urlAPI = null;
        break;
    }
    return urlAPI;
  }
}
