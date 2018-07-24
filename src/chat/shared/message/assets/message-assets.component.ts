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

  constructor(
    private chatService: ChatService,
    private commonEventService: CommonEventService,
    private userService: UserService,
    private wthConfirmService: WthConfirmService,
    private addContactService: ZChatShareAddContactService,
    private messageAssetsService: MessageAssetsService
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
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  tabAction(event: WTab) {
    this.currentTab = event.link;
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
}
