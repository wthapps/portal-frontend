import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit, ViewEncapsulation
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import {Message} from 'primeng/components/common/api';
import {MessageService} from 'primeng/components/common/messageservice';

import { ChatService } from './shared/services/chat.service';
import { ConfirmDialogModel } from '@wth/shared/shared/models/confirm-dialog.model';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';
import { Constants, NETWORK_ONLINE } from '@wth/shared/constant';
import { AuthService, StorageService } from '@wth/shared/services';
import { IntroductionModalComponent } from '@wth/shared/modals/introduction/introduction.component';
import { PageVisibilityService } from '@shared/services/page-visibility.service';
import { ChatConversationService } from './shared/services/chat-conversation.service';

declare const _: any;
/**
 * This class represents the main application component.
 */
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('introduction') introduction: IntroductionModalComponent;
  msgs: Message[] = [];
  routerSubscription: Subscription;
  hiddenSubscription: Subscription;

  confirmDialog: ConfirmDialogModel = Constants.confirmDialog;

  constructor(
    public authService: AuthService,
    private router: Router,
    private chatService: ChatService,
    private messageService: MessageService,
    private storageService: StorageService,
    private chatConversationService: ChatConversationService,
    private visibilityService: PageVisibilityService,
    private wthConfirmService: WthConfirmService
  ) {
    this.wthConfirmService.confirmDialog$.subscribe((res: any) => {
      this.confirmDialog = res;
    });
    this.storageService.save(NETWORK_ONLINE, true);
  }

  ngOnInit() {
    this.chatService.initalize();
    this.handleOnlineOffline();

    this.hiddenSubscription = this.visibilityService.hiddenState$.subscribe(hidden => {
      this.handleBrowserState(!hidden);
    });

    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        document.body.scrollTop = 0;
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
    // tslint:disable-next-line:max-line-length
    this.messageService.add({severity: 'error', summary: 'No internet connection', detail: 'Please check your connection and try again',
    closable: false, life: 3600 * 24});
  }

  clearOfflineMessage() {
    this.messageService.clear();
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
    this.hiddenSubscription.unsubscribe();
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
    this.chatConversationService.apiGetConversations();
    this.chatService.getOutOfDateMessages();
  }

  private setNetworkOnline(online: boolean) {
    this.storageService.save(NETWORK_ONLINE, online);
  }

}
