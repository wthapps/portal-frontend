import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit, ViewEncapsulation
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import {MessageService} from 'primeng/components/common/messageservice';

import { ChatService } from './shared/services/chat.service';
import { ConfirmDialogModel } from '@wth/shared/shared/models/confirm-dialog.model';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';
import { Constants, NETWORK_ONLINE } from '@wth/shared/constant';
import { AuthService, StorageService } from '@wth/shared/services';
import { IntroductionModalComponent } from '@wth/shared/modals/introduction/introduction.component';
import { PageVisibilityService } from '@shared/services/page-visibility.service';
import { ChatConversationService } from './shared/services/chat-conversation.service';
import { Socket, Presence } from 'phoenix';
import { CardDetailModalComponent } from '@shared/user/card';
import { ProfileService } from '@shared/user/services';
import { UserEventService } from '@shared/user/event';

declare const _: any;

/**
 * This class represents the main application component.
 */
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('introduction') introduction: IntroductionModalComponent;
  @ViewChild('cardDetailModal') cardDetailModal: CardDetailModalComponent;

  confirmDialog: ConfirmDialogModel = Constants.confirmDialog;
  // profile: any;
  profile$: Observable<any>;
  private destroy$ = new Subject();


  constructor(
    public authService: AuthService,
    private router: Router,
    private chatService: ChatService,
    private messageService: MessageService,
    private storageService: StorageService,
    private chatConversationService: ChatConversationService,
    private visibilityService: PageVisibilityService,
    private wthConfirmService: WthConfirmService,
    private profileService: ProfileService,
    private userEventService: UserEventService
  ) {
    this.wthConfirmService.confirmDialog$.subscribe((res: any) => {
      this.confirmDialog = res;
    });
    this.storageService.save(NETWORK_ONLINE, true);

  }

  ngOnInit() {
    this.chatService.initalize();
    this.handleOnlineOffline();

    this.visibilityService.hiddenState$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(hidden => {
      this.handleBrowserState(!hidden);
    });

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: any) => {
        document.body.scrollTop = 0;
      });

    this.profile$ = this.profileService.profile$;
    this.visibilityService.reloadIfProfileInvalid();

    this.userEventService.viewProfile$.pipe(takeUntil(this.destroy$)).subscribe(user => {
      this.profileService.getProfileNew(user.uuid);
      this.cardDetailModal.open({});
      });
  }

  ngAfterViewInit() {
    if (
      !_.get(this.authService, 'user.introduction.chat')
    ) {
      this.introduction.open();
    }
  }


  handleOnlineOffline() {
    window.addEventListener('online', () => this.updateChatMessages());
    window.addEventListener('offline', () => this.updateChatMessages());
  }

  showOfflineMessage() {
    this.messageService.add({severity: 'error', summary: 'No internet connection', detail: 'Please check your connection and try again',
    closable: false, life: 3600 * 24});
  }

  clearOfflineMessage() {
    this.messageService.clear();
  }

  // Conversation handle
  createConversation(payload: any) {

  }

  // Conversation handle end

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private handleBrowserState(isActive) {
    if (isActive) {
      this.getOutOfDateData();
    }
  }

  private updateChatMessages() {
    const online = navigator.onLine;
    this.setNetworkOnline(online);
    if (online) {
      this.getOutOfDateData();
      this.clearOfflineMessage();
    } else {
      this.showOfflineMessage();
    }
  }

  private getOutOfDateData() {
    this.chatService.getOutOfDateMessages();
  }

  private setNetworkOnline(online: boolean) {
    this.storageService.save(NETWORK_ONLINE, online);
  }

}
