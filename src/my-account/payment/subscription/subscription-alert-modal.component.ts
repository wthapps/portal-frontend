import { Component, OnInit, ViewChild } from '@angular/core';
import { Constants } from '@shared/constant';
import { BsModalComponent } from 'ng2-bs3-modal';

@Component({
  selector: 'subscription-alert-modal',
  templateUrl: 'subscription-alert-modal.component.html'
})
export class SubscriptionAlertModalComponent implements OnInit {
  @ViewChild('modal') modal: BsModalComponent;

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

  close() {
    this.modal.close();
  }
}
