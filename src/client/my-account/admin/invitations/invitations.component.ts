import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import 'rxjs/add/operator/toPromise';

import { InvitationService } from '../../../core/shared/components/invitation/invitation.service';
import { ToastsService } from '../../../core/shared/components/toast/toast-message.service';
import { LoadingService } from '../../../core/shared/components/loading/loading.service';

declare let _: any;

@Component({
  moduleId: module.id,
  selector: 'my-invitations',
  templateUrl: 'invitations.component.html',
  providers: [InvitationService]
})

export class MyInvitationsComponent implements OnInit {

  data: Array<any>;
  items: Array<any> = new Array<any>();
  modal: any;
  totalPending: number;
  totalAccepted: number;
  currentTab: string;
  currentTabTitle: string;

  readonly TAB: any = {
    PENDING: { value: 'pending', name: 'Pending'},
    ACCEPTED: { value: 'accepted', name: 'Accepted invitation'}
  };

  constructor(
    private invitationService: InvitationService,
    private toaster: ToastsService,
    private route: ActivatedRoute,
    private loadingService: LoadingService
  ) {
  }

  ngOnInit() {
    this.invitationService.getAll().toPromise().then((response: any) => {
      this.items = response.data;
    });

    this.currentTab = this.TAB.PENDING.value;
    this.route.queryParams.subscribe((queryParam: any) => {
      this.currentTab = queryParam['tab'] || this.TAB.PENDING.value;
      this.currentTabTitle = _.find(this.TAB, ['key', this.currentTab]);
    });

    this.fakeCount();
  }

  fakeCount() {
    this.totalPending = 5;
    this.totalAccepted = 6;
  }

  addRecipients(modal: any) {
    this.modal = modal;
    modal.open({data: this.data});
  }

  doEvent(event: any) {
    this.loadingService.start();
    switch (event.action) {
      case 'invitation:send_to_recipients':

        this.invitationService.create({recipients: event.payload}).subscribe((response: any) => {
            this.loadingService.stop();
            this.toaster.success('You have just sent invitation(s) successfully!');
          },
          (error: any) => {
            this.loadingService.stop();
            this.toaster.danger('There is a error when you sent invitation(s)!');
          }
        );
        this.modal.close();
        break;
      case 'resend':
        let recipient = {
          email: event.payload.item.recipient_email,
            fullName: event.payload.item.recipient_full_name,
          contactId: event.payload.item.recipient_contact_id,
        };
        this.invitationService.resend({id: event.payload.item.id, recipient: recipient}).subscribe((response: any) => {
          this.loadingService.stop();
          this.toaster.success('You have just resent invitation successfully!');
        },
        (error: any) => {
          this.loadingService.stop();
          this.toaster.danger('There is a error when you resent invitation!');
        });
        break;
    }
  }

  onSelect(item: any) {
    console.log('On Select: ', item);
  }

  onSelectAll() {
    console.log('On Select All');
  }

  onResend() {

  }

  onRemove() {

  }
}
