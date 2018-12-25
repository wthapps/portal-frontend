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

import {Message} from 'primeng//api';
import {MessageService} from 'primeng/api';

import { ChatService } from './shared/services/chat.service';
import { ConfirmDialogModel } from '@wth/shared/shared/models/confirm-dialog.model';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';
import { Constants } from '@wth/shared/constant';
import { AuthService } from '@wth/shared/services';
import { IntroductionModalComponent } from '@wth/shared/modals/introduction/introduction.component';
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

  routerSubscription: Subscription;

  confirmDialog: ConfirmDialogModel = Constants.confirmDialog;

  constructor(
    public authService: AuthService,
    private router: Router,
    private chatService: ChatService,
    private messageService: MessageService,
    private wthConfirmService: WthConfirmService
  ) {
    this.wthConfirmService.confirmDialog$.subscribe((res: any) => {
      this.confirmDialog = res;
    });
  }

  ngOnInit() {
    this.chatService.initalize();
    this.handleOnlineOffline();

    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        document.body.scrollTop = 0;
      });
  }

  ngAfterViewInit() {
    if (
      !this.authService.user.introduction ||
      !this.authService.user.introduction.chat
    ) {
      this.introduction.open();
    }
  }

  handleOnlineOffline() {
    window.addEventListener('online', () => this.updateIndicator());
    window.addEventListener('offline', () => this.updateIndicator());
  }

  showOfflineMessage() {
    this.messageService.add({severity: 'error', summary: 'No internet connection', detail: 'Please check your connection and try again'});
  }

  clearOfflineMessage() {
    this.messageService.clear();
  }

  updateIndicator() {
    console.log('on/off: ', navigator.onLine);
    if (navigator.onLine) {
      this.chatService.getOutOfDateMessages();
      this.clearOfflineMessage();
    } else {
      this.showOfflineMessage();
    }
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }
}
