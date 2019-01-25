import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadingService } from '@shared/shared/components/loading/loading.service';

import { InvitationService } from '@wth/shared/shared/components/invitation/invitation.service';
import { MessageService } from 'primeng/api';
import { map } from 'rxjs/operators';

declare let _: any;

@Component({
  selector: 'my-invitations',
  templateUrl: 'invitations.component.html',
  styleUrls: ['invitations.component.scss'],
  providers: [InvitationService]
})

export class MyInvitationsComponent implements OnInit, OnDestroy {
  invPending: any[] = null;
  invAccepted: any[] = null;
  cols: any[];
  selectedPending: any = [];
  selectedAccepted: any = [];
  currentTab: string; // pending, accepted

  constructor(private invitationService: InvitationService,
              private messageService: MessageService,
              private loadingService: LoadingService) {
    this.currentTab = 'pending';
    this.cols = [
      { field: 'recipient_email', header: 'Email' },
      { field: 'created_at', header: 'Sent date' }
    ];
  }

  ngOnInit() {
    this.getData().then();
  }

  ngOnDestroy() {
  }

  async getData() {
    this.invPending = await this.invitationService.getByStatus({ status: 'pending' })
      .pipe(map(res => res.data))
      .toPromise();
    this.invAccepted = await this.invitationService.getByStatus({ status: 'accepted' })
      .pipe(map(res => res.data))
      .toPromise();
  }

  doEvent(event: any) {
    console.log(event);

    switch (event.action) {
      case 'invitation:send_successfully':
        this.invPending = [...this.invPending, ...event.payload];
        break;
      case 'invitation:send_to_recipients':
        break;
    }
  }

  onResend(selectedItems: any) {
    // console.log(selectedItems);
    this.loadingService.start();
    const ids = _.map(selectedItems, 'id');
    this.invitationService.multiResend({ ids: ids }).toPromise()
      .then(
        () => {
          this.loadingService.stop();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'You have just resent invitations successfully!'
          });
        },
        () => {
          this.loadingService.stop();
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'There is a error when you resent invitations!'
          });
        });
    this.clear();
  }

  onRemove(selectedItems: any) {
    // console.log(selectedItems);
    this.loadingService.start();
    const ids = _.map(selectedItems, 'id');
    this.invitationService.multiDelete({ 'ids': ids })
      .subscribe(
        () => {
          this.loadingService.stop();
          _.remove(this.invAccepted, (i: any) => ids.indexOf(i.id) !== -1);
          _.remove(this.invPending, (i: any) => ids.indexOf(i.id) !== -1);
        });
    this.clear();
  }

  clear() {
    this.selectedPending.length = 0;
    this.selectedAccepted.length = 0;
  }
}
