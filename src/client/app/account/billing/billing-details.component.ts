import { Component, OnInit }            from '@angular/core';
import { Router }    from '@angular/router';
import {
  UserService,
  //2 LoadingService,
  //2 DialogService,
  ToastsService
}                                     from '../../shared/index';
import { Cookie }                       from 'ng2-cookies/ng2-cookies';
import { CreditCard }                   from '../../shared/models/credit-card.model';
import { BillingAddress }               from '../../shared/models/billing-address.model';

@Component({
  moduleId: module.id,
  templateUrl: 'billing-details.component.html'
})

export class BillingDetailsComponent implements OnInit {
  pageTitle: string = 'Billing Details';
  credit_card: CreditCard;

  constructor(private userService: UserService,
              private router: Router,
              //2 private loadingService: LoadingService,
              //2 private dialogService: DialogService,
              private toastsService: ToastsService) {
    //console.log(this.userService);
  }

  ngOnInit(): void {
    if (this.userService.profile.has_payment_info) {
      this.credit_card = this.userService.profile.credit_cards[0];
    } else {
      this.credit_card = new CreditCard({billing_address: new BillingAddress});
    }
  }

  /*onEdit(event: any): void {
   event.preventDefault();
   this.router.navigateByUrl(
   `/account/payment;operation=edit;${Constants.params.next}=${this.router.location.path().replace(/\//g, '\%20')}`
   );
   }*/

  onDelete(event: any): void {
    event.preventDefault();
    //2
    /*this.dialogService.activate('Are you sure to delete Billing details?', 'Delete billing details')
     .then((responseOK) => {
     if (responseOK) {
     this.loadingService.start();
     this.userService.delete(`/users/${this.userService.profile.id}/payments/1`).subscribe(
     response => {
     this.loadingService.stop();
     this.toastsService.success('The billing details has been deleted.');
     this.userService.profile.has_payment_info = false;
     this.userService.profile.credit_cards = null;
     // Cookie.delete('profile');
     Cookie.set('profile', JSON.stringify(this.userService.profile), 365, '/');
     },
     error => {
     this.loadingService.stop();
     this.toastsService.danger('Unable to delete the billing details.');
     }
     );
     }
     });*/
  }
}
