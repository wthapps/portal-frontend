import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { WTab } from '@shared/components/w-nav-tab/w-nav-tab';
import { Constants } from '@shared/constant';
import { ChatService } from '@chat/shared/services/chat.service';
import { WthConfirmService } from '@shared/shared/components/confirmation/wth-confirm.service';
import { CommonEventService, UserService } from '@shared/services';
import { MessageAssetsService } from '@chat/shared/message/assets/message-assets.service';
import { ZChatShareAddContactService } from '@chat/shared/modal/add-contact.service';
import { componentDestroyed } from 'ng2-rx-componentdestroyed';
import { Observable } from 'rxjs/Observable';
import { takeUntil } from 'rxjs/operators';
import { Media } from '@shared/shared/models/media.model';
import { ResponseMetaData } from '@shared/shared/models/response-meta-data.model';
import { WObjectListService } from '@shared/components/w-object-list/w-object-list.service';


@Component({
  selector: 'message-assets',
  templateUrl: 'message-assets.component.html',
  styleUrls: ['message-assets.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MessageAssetsComponent implements OnInit, OnDestroy {
  @Input() chatContactList: { [partner_id: string]: any } = {};
  contactSelect: any;
  tooltip: any = Constants.tooltip;
  showMembers: boolean;
  tabsMember: WTab = {
    name: 'Members',
    link: 'members',
    icon: null,
    number: null,
    type: 'tab'
  };
  tabs: WTab[] = [
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

  currentTab: string; // members, photos, notes, files

  profileUrl: any;

  medias$: Observable<Media[]>;
  nextLink: string;
  isLoading: boolean;

  constructor(
    private chatService: ChatService,
    private commonEventService: CommonEventService,
    private userService: UserService,
    private wthConfirmService: WthConfirmService,
    private addContactService: ZChatShareAddContactService,
    private messageAssetsService: MessageAssetsService,
    private objectListService: WObjectListService
  ) {
    this.profileUrl = this.chatService.constant.profileUrl;

    this.currentTab = 'photos';

    let close$: Observable<any> = Observable.merge(
      componentDestroyed(this)
    );

    this.chatService.getContactSelectAsync()
      .pipe(takeUntil(close$))
      .subscribe((res: any) => {
        this.contactSelect = res;
        if (this.contactSelect && this.contactSelect.group_json) {
          this.showMembers = this.contactSelect.group_json.member_count > 2;
          if (
            this.showMembers &&
            _.findIndex(this.tabs, ['link', 'members']) === -1
          ) {
            this.currentTab = 'members';
            this.tabs.unshift(this.tabsMember);
          } else {
            this.currentTab = 'photos';
            _.remove(this.tabs, ['link', 'members']);
          }
        }
      });

    this.medias$ = this.messageAssetsService.medias$;
  }

  ngOnInit() {
    this.objectListService.setMultipleSelection(false);
  }

  ngOnDestroy() {
  }

  tabAction(event: WTab) {
    this.currentTab = event.link;
    if (this.currentTab !== 'member') {
      this.nextLink = this.buildNextLink();
      if (this.nextLink) {
        this.getObjects(true);
      } else {
        this.messageAssetsService.clear();
      }
    }
  }

  onClose() {
    this.messageAssetsService.close();
  }

  onSelect(user: any) {
    this.chatService.selectContactByPartnerId(user.id);
  }

  onAddMember() {
    this.addContactService.open('addMember');
  }

  onRemoveFromConversation(user: any) {
    this.chatService.removeFromConversation(this.contactSelect, user.id);
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
