import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadingService } from '@shared/shared/components/loading/loading.service';
import { ToastsService } from '@shared/shared/components/toast/toast-message.service';

import { InvitationService } from '@wth/shared/shared/components/invitation/invitation.service';

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
              private toastsService: ToastsService,
              private loadingService: LoadingService) {
    this.currentTab = 'pending';
    this.cols = [
      { field: 'recipient_email', header: 'Email' },
      { field: 'created_at', header: 'Sent date' }
    ];
  }

  ngOnInit() {
    this.invitationService.getByStatus({ status: 'pending' })
      .subscribe((res: any) => {
        this.invPending = res.data;
      });
    this.invitationService.getByStatus({ status: 'accepted' })
      .subscribe((res: any) => {
        this.invAccepted = res.data;
      });
  }

  ngOnDestroy() {
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
      .then(() => {
          this.loadingService.stop();
          this.toastsService.success('You have just resent invitations successfully!');
        },
        () => {
          this.loadingService.stop();
          this.toastsService.danger('There is a error when you resent invitations!');
        });
    this.clear();
  }

  onRemove(selectedItems: any) {
    // console.log(selectedItems);
    this.loadingService.start();
    const ids = _.map(selectedItems, 'id');
    this.invitationService.multiDelete({ 'ids': ids })
      .subscribe(() => {
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
