import { Component, OnInit } from '@angular/core';

import { InvitationService } from './invitation.service';
import { ToastsService } from '../../../core/shared/components/toast/toast-message.service';
import { LoadingService } from '../../../core/shared/components/loading/loading.service';

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

  constructor(
    private invitationService: InvitationService,
    private toaster: ToastsService,
    private loadingService: LoadingService
  ) {

  }

  ngOnInit() {
    this.invitationService.getAll().subscribe((response: any) => {
      this.items = response.data;
    });
  }

  addRecipients(modal: any) {
    this.modal = modal;
    modal.open({data: this.data});
  }

  doEvent(event: any) {
    this.loadingService.start();
    switch (event.action) {
      case 'done':

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
          // this.loadingService.stop();
          this.toaster.success('You have just resent invitation successfully!');
        },
        (error: any) => {
          this.loadingService.stop();
          this.toaster.danger('There is a error when you resent invitation!');
        });
        break;
    }
  }
}
