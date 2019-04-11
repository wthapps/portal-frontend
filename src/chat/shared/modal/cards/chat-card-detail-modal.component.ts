import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';

import { ProfileService } from '@shared/user/services';
import { UserEventService } from '@shared/user/event';
import { ApiBaseService } from '@shared/services';
import { ToastsService } from '@shared/shared/components/toast/toast-message.service';

interface CardStatusResponse {
  inContact: boolean;
}

@Component({
  selector: 'w-chat-card-detail-modal',
  template: `
  <w-card-detail-modal #cardDetailModal [card]="card">
  <li class="dropdown card-actions" #cardActions>
      <button class="btn btn-default btn-default-no-border" type="button" data-toggle="dropdown" (click)="getCardStatus(card)">
        <i class="fa fa-ellipsis-v" aria-hidden="true"></i>
      </button>
      <ul class="dropdown-menu dropdown-menu-right">
      <ng-container *ngIf="!loading && !cardStatus?.inContact">
        <li >
            <a href="javascript:;" role="button" (click)="importContact(card)">
            <i class="fa fa-user-plus" aria-hidden="true"></i> Import as a contact</a>
          </li>
        <li role="separator" class="divider"></li>
      </ng-container>
        <li>
          <a href="javascript:;" role="button" (click)="goToChat(card)"><i class="fa fa-comments-o" aria-hidden="true"></i> Send message</a>
        </li>
        <li>
            <a href="javascript:;" role="button" (click)="addBlacklist(card)"><i class="fa fa-ban" aria-hidden="true"></i> Blacklist</a>
          </li>
      </ul>
    </li>
</w-card-detail-modal>
  `
})
export class ZChatCardDetailModalComponent implements OnDestroy {
  @Input() card;
  @ViewChild('cardDetailModal') cardDetailModal;
  cardStatus: CardStatusResponse;
  loading = false;

  private destroy$: Subject<any>;

  constructor(
    private api: ApiBaseService,
    private profileService: ProfileService,
    private toastsService: ToastsService,
    private userEventService: UserEventService) {

  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  open() {
    this.cardDetailModal.open();
  }

  close() {
    this.cardDetailModal.close();
  }

  async getCardStatus(user) {
    this.loading = true;
    this.cardStatus = await this.api.post('contact/wcontacts/get_profile_status', user).toPromise();
    this.loading = false;
  }

  goToChat(user) {
    this.userEventService.createChat(user);
    this.cardDetailModal.close();
  }

  async importContact(user) {
    console.log('importContact: ', user);
    try {
      this.cardStatus = await this.api.post('contact/wcontacts/import_contact', user).toPromise();
      this.cardStatus.inContact = true;
      this.toastsService.success(`${user.first_name} ${user.last_name} has been imported into contact book successfully`);
    } catch (err) {
      this.toastsService.danger(`Oops, cannot import ${user.first_name} ${user.last_name} into contact book. Please try again`);
    }
  }

  openInContact(user) {
    console.log('open in contact: ', user);
  }

  addBlacklist(user) {
    console.log('add blacklist: ', user);
  }
}
