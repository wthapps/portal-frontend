import { Component }                from '@angular/core';
import { InvitationService } from './invitation.service';

@Component({
  moduleId: module.id,
  selector: 'my-invitations',
  templateUrl: 'invitations.component.html',
  providers: [InvitationService]
})

export class MyInvitationsComponent {

  data: Array<any> = [
    {fullName: 'jack huynh', email: 'jack@wthapps.com', contactId: 1},
    {fullName: 'philip', email: 'phil@wthapps.com', contactId: 1},
    {fullName: 'john tran', email: 'john@wthapps.com', contactId: 1}
    ];

  constructor(private invitationService: InvitationService) {

  }

  openModal(modal: any) {
    modal.open({data: this.data});
  }

  doEvent(event: any) {
    switch (event.action) {
      case 'done':

        this.invitationService.create({recipients: event.payload}).subscribe((response: any) => {
            console.log('sent invitations successfully:::', response.data);
          },
          (error: any) => {

          }
        );
        break;
    }
  }
}
