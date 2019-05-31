import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Constants } from '@shared/constant';
import { BsModalComponent } from 'ng2-bs3-modal';

@Component({
  selector: 'subscription-cancel-modal',
  templateUrl: 'subscription-cancel-modal.component.html'
})
export class SubscriptionCancelModalComponent implements OnInit {
  @ViewChild('modal') modal: BsModalComponent;
  @Output() onNext: EventEmitter<boolean> = new EventEmitter<boolean>();
  dashboardUrl = Constants.baseUrls.myAccount + '/dashboard';
  faqUrl = Constants.baseUrls.app + '/faq';
  contactUsUrl = Constants.baseUrls.app + '/contact';

  constructor(
  ) {}

  ngOnInit() {

  }

  open() {
    this.modal.open();
  }

  close(next?: boolean) {
    this.modal.close();
    if (next) {
      this.onNext.emit(true);
    }
  }
}
