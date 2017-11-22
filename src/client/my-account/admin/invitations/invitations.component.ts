import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs/Subject';
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

export class MyInvitationsComponent implements OnInit, OnDestroy {
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

  private destroySubject: Subject<any> = new Subject<any>();
  constructor(
    private invitationService: InvitationService,
    private toaster: ToastsService,
    private route: ActivatedRoute,
    private loadingService: LoadingService
  ) {
  }

  ngOnInit() {

    this.currentTab = this.TAB.PENDING.value;
    this.route.queryParams.takeUntil(this.destroySubject.asObservable()).map((queryParam: any) => {
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

  ngOnDestroy() {
    this.destroySubject.next('');
    this.destroySubject.unsubscribe();
  }

  addRecipients(modal: any) {
    this.modal = modal;
    modal.open({data: this.data});
  }


  doEvent(event: any) {
    this.loadingService.start('#loading');
    switch (event.action) {
      case 'invitation:send_to_recipients':

        console.log(event);
        this.invitationService.create({recipients: event.payload}).subscribe((response: any) => {
            this.items = _.uniqBy([...this.items, ...response.data], 'recipient_email');
            this.loadingService.stop('#loading');
            this.toaster.success('You have just sent invitation(s) successfully!');
          },
          (error: any) => {
            this.loadingService.stop('#loading');
            this.toaster.danger('There is a error when you sent invitation(s)!');
          }
        );
        this.modal.close();
        break;
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
    } else {
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
    this.loadingService.start('#loading');

    this.invitationService.multiResend({ids: ids}).toPromise().then((response: any) => {
        this.loadingService.stop('#loading');
        this.toaster.success('You have just resent invitations successfully!');
      },
      (error: any) => {
        this.loadingService.stop('#loading');
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
