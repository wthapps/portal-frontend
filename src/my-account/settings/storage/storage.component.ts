import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonEventService } from '@shared/services';
import { BsModalComponent } from 'ng2-bs3-modal';


@Component({
  selector: 'my-setting-storage',
  templateUrl: 'storage.component.html',
  styleUrls: ['storage.component.scss']
})

export class MyStorageComponent implements OnInit {
  @ViewChild('modal') modal: BsModalComponent;
  @ViewChild('modalPlan') modalPlan: BsModalComponent;

  val1: string;

  constructor(private commonEventService: CommonEventService) {
  }

  ngOnInit() {
  }

  openSubscriptionUpdateModal() {
    this.modalPlan.close();
    setTimeout(() => {
      this.commonEventService.broadcast({
        channel: 'my_account',
        action: 'my_account:subscription:open_subscription_update_modal',
        payload: null
      });
    }, 0);
  }
}
