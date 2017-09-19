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
  selectedItems: Array<any> = [];
  isSelectAll: boolean;
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

    this.currentTab = this.TAB.PENDING.value;
    this.route.queryParams.map((queryParam: any) => {
      this.currentTab = queryParam['tab'] || this.TAB.PENDING.value;
      this.currentTabTitle = _.find(this.TAB, ['value', this.currentTab]);
      this.selectedItems.length = 0;
      return queryParam;
    }).switchMap(() => {
      return this.invitationService.getByStatus({status: this.currentTab});
    }).subscribe((response: any) => {
      this.items = response.data;
    });
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
      // case 'resend':
      //   let recipient = {
      //     email: event.payload.item.recipient_email,
      //       fullName: event.payload.item.recipient_full_name,
      //     contactId: event.payload.item.recipient_contact_id,
      //   };
      //   this.invitationService.resend({id: event.payload.item.id, recipient: recipient}).subscribe((response: any) => {
      //     this.loadingService.stop();
      //     this.toaster.success('You have just resent invitation successfully!');
      //   },
      //   (error: any) => {
      //     this.loadingService.stop();
      //     this.toaster.danger('There is a error when you resent invitation!');
      //   });
      //   break;
    }
  }

  onSelect(item: any) {
    let selectedItem = _.find(this.selectedItems, (i: any) => i.uuid === item.uuid);
    if(!selectedItem) {
      this.selectedItems.push(item);
      item = Object.assign({},item, {selected: true});
      if(this.selectedItems.length === this.items.length)
        this.isSelectAll = true;
    } else {
      _.remove(this.selectedItems, (i: any) => i.uuid === item.uuid);
      item = Object.assign({},item, {selected: false});
      this.isSelectAll = false;
    }
  }

  onSelectAll() {
    if(this.selectedItems.length !== this.items.length) {
      this.selectedItems = [...this.items];
      this.items = _.map(this.items, (i: any) => Object.assign({}, i, {selected: true}));
      this.isSelectAll = true;
    }
    else {
      this.selectedItems.length = 0;
      this.items = _.map(this.items, (i: any) => Object.assign({}, i, {selected: false}));
      this.isSelectAll = false;
    }
  }

  onResend(item?: any) {
    let ids: any[] = [];

    if(item) {
      ids = [item.id];
    } else {
      ids = _.map(this.selectedItems, 'id');
    }

    this.invitationService.multiResend({ids: ids}).toPromise().then((response: any) => {
        this.loadingService.stop();
        this.toaster.success('You have just resent invitations successfully!');
      },
      (error: any) => {
        this.loadingService.stop();
        this.toaster.danger('There is a error when you resent invitations!');
      });
  }


  onRemove(item?: any) {
    if(item) {
      this.invitationService.multiDelete({'ids': [item.id]}).toPromise()
        .then((res: any) => _.remove(this.items, (i: any) => i.uuid === item.uuid));
    } else {
      // Remove selected
      let ids = _.map(this.selectedItems, 'id');
      this.invitationService.multiDelete({'ids': ids}).toPromise()
        .then((res: any) => _.remove(this.items, (i: any) => ids.indexOf(i.id) !== -1));
    }
  }

  parseRecipient(item: any) {
    return {
      email: item.recipient_email,
      fullName: item.recipient_full_name,
      contactId: item.recipient_contact_id
    };
  }
}
