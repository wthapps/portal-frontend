import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Constants } from '@shared/constant';
import { BsModalComponent } from 'ng2-bs3-modal';

@Component({
  selector: 'subscription-cancel-modal',
  templateUrl: 'subscription-cancel-modal.component.html'
})
export class SubscriptionCancelModalComponent {
  @ViewChild('modal') modal: BsModalComponent;
  @Output() onNext: EventEmitter<boolean> = new EventEmitter<boolean>();

  subscription: any;
  deletedDayNum: number;

  readonly dashboardUrl = Constants.baseUrls.myAccount + '/dashboard';
  readonly faqUrl = Constants.baseUrls.app + '/faq';
  readonly contactUsUrl = Constants.baseUrls.app + '/contact';

  open(options: { subscription: any, deletedDayNum: number }) {
    this.subscription = options.subscription;
    this.deletedDayNum = options.deletedDayNum;

    this.modal.open();
  }

  close(next?: boolean) {
    this.modal.close();
    if (next) {
      this.onNext.emit(true);
    }
  }
}
