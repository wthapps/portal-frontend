import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { WTab } from '@shared/components/w-nav-tab/w-nav-tab';
import { Constants } from '@shared/constant';
import { ChatService } from '@chat/shared/services/chat.service';
import { WthConfirmService } from '@shared/shared/components/confirmation/wth-confirm.service';
import { CommonEventService, UserService } from '@shared/services';
import { MessageAssetsService } from '@chat/shared/message/assets/message-assets.service';

@Component({
  selector: 'message-assets',
  templateUrl: 'message-assets.component.html',
  styleUrls: ['message-assets.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class MessageAssetsComponent implements OnInit, OnDestroy {
  @Input() contactSelect: any;
  @Input() chatContactList: { [partner_id: string]: any } = {};
  tooltip: any = Constants.tooltip;

  tabs: WTab[] = [
    {
      name: 'Members',
      link: 'members',
      icon: null,
      number: null,
      type: 'tab'
    },
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

  constructor(private chatService: ChatService,
              private commonEventService: CommonEventService,
              private userService: UserService,
              private wthConfirmService: WthConfirmService,
              private messageAssetsService: MessageAssetsService) {
    this.profileUrl = this.chatService.constant.profileUrl;

    this.currentTab = 'members';
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
