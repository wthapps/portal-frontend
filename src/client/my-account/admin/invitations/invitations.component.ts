import { Component }                from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'my-invitations',
  templateUrl: 'invitations.component.html'
})

export class MyInvitationsComponent {

  openModal(modal: any) {
    modal.open();
  }
}
