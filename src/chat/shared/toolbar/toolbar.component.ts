import { Component, ViewChild, OnInit, Input, Renderer2, OnDestroy, EventEmitter, Output } from '@angular/core';

import { Subject, Observable } from 'rxjs';
import { takeUntil, merge } from 'rxjs/operators';

import { ChatService } from '../services/chat.service';
import { ZChatShareEditConversationComponent } from '../modal/edit-conversation.component';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';
import { Constants } from '@wth/shared/constant';
import { MessageAssetsService } from '@chat/shared/message/assets/message-assets.service';
import { UserService, CommonEventService } from '@shared/services';
import { ChatConversationService } from '../services/chat-conversation.service';
import { ContactSelectionService } from '@chat/shared/selections/contact/contact-selection.service';


declare let $: any;
declare let _: any;
declare let window: any;

@Component({
  selector: 'z-chat-share-toolbar',
  templateUrl: 'toolbar.component.html',
  styleUrls: ['toolbar.component.scss']
})

export class ZChatToolbarComponent implements OnInit, OnDestroy {
  @ViewChild('editConversation') editConversation: ZChatShareEditConversationComponent;
  @Input() conversation: any;
  @Input() inContactBook = true;
  @Output() onFavorite: EventEmitter<any> = new EventEmitter<any>();
  @Output() onNotify: EventEmitter<any> = new EventEmitter<any>();
  @Output() onAddMember: EventEmitter<any> = new EventEmitter<any>();


  showMemberBar = false;
  usersOnlineItem$: Observable<any>;
  profileUrl: any;
  showSendMessage = false;
  showBlacklist = false;

  openAssets: boolean;
  destroy$ = new Subject();

  readonly tooltip: any = Constants.tooltip;

  constructor(
    public userService: UserService,
    private chatService: ChatService,
    private chatConversationService: ChatConversationService,
    private wthConfirmService: WthConfirmService,
    private commonEventService: CommonEventService,
    private renderer: Renderer2,
    private messageAssetsService: MessageAssetsService,
    private contactSelectionService: ContactSelectionService
    ) {
    this.profileUrl = this.chatService.constant.profileUrl;

    this.messageAssetsService.open$
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res: any) => {
          this.openAssets = res;
          if (!res) {
            this.renderer.removeClass(document.body, 'open-chat-message-assets');
          } else {
            this.renderer.addClass(document.body, 'open-chat-message-assets');
          }
        });
  }

  ngOnInit() {
    // this.item = this.chatService.getContactSelect();
    this.usersOnlineItem$ = this.chatService.getUsersOnline();

  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onAddContact() {
    // this.addContactService.open('addContact');
    this.contactSelectionService.open({type: 'addContact'});
  }

  addMember() {
    this.onAddMember.emit(this.conversation);
    // this.commonEventService.broadcast({
    //   channel: 'ZChatShareAddContactComponent',
    //   action: 'open',
    //   payload: {option: 'addMember', conversationSelected: this.conversation}
    // })

  }

  sendContact() {
    // this.addContactService.open('shareContact');
    this.contactSelectionService.open({type: 'shareContact'});
  }

  onEditConversation() {
    this.editConversation.open();
  }

  favorite() {
    // this.chatConversationService.apiFavoriteGroupUser(this.conversation);
    this.onFavorite.emit(Object.assign({}, {...this.conversation, favorite: !this.conversation.favorite}));
  }

  toggleNotification() {
    // this.chatConversationService.apiNotificationGroupUser(this.conversation);
    this.onNotify.emit(Object.assign({}, {...this.conversation, notification: !this.conversation.notification}));

  }

  leaveConversation() {
    this.chatConversationService.leaveConversation(this.conversation);
  }

  onHideConversation() {
    this.wthConfirmService.confirm({
      acceptLabel: 'Hide',
      message: 'Are you sure you want to hide this conversation?',
      header: 'Hide Chat',
      accept: () => {
        this.chatConversationService.apHideConversation(this.conversation);
      }
    });
  }

  onDeleteConversation() {
    this.wthConfirmService.confirm({
      acceptLabel: 'Delete',
      message: 'This conversation will be deleted from your message list only. not everyone else.<br><br> This action can\'t be undone',
      header: 'Delete Conversation',
      accept: () => {
        this.chatConversationService.apiDeleteConversation(this.conversation);
      }
    });
  }

  viewProfile() {
    this.commonEventService.broadcast({
      channel: 'CardUserComponent',
      action: 'open',
      payload: this.conversation.partner
    })
  }

  onSelect(user: any) {
    this.chatService.selectContactByPartnerId(user.id);
  }

  onShowAssets() {
    if (this.openAssets) {
      this.messageAssetsService.close();
    } else {
      this.messageAssetsService.open();
    }
  }
}
