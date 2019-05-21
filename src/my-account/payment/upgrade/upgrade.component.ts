import { Component, AfterViewInit, NgZone, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  AbstractControl,
  Validators
} from '@angular/forms';

import { CookieService, CookieOptions } from 'ngx-cookie';
import { CreditCard } from '@shared/shared/models/credit-card.model';
import { UserService } from '@shared/services/user.service';
import { MyPaymentService } from '../payment.service';
import { ApiBaseService } from '@shared/services/apibase.service';
import { CountryService } from '@shared/shared/components/countries/countries.service';
import { LoadingService } from '@shared/shared/components/loading/loading.service';
import { ToastsService } from '@shared/shared/components/toast/toast-message.service';
import { BillingAddress } from '@shared/shared/models/billing-address.model';
import { Constants } from '@shared/constant/config/constants';

@Component({
  selector: 'my-payment-upgrade',
  templateUrl: 'upgrade.component.html'
})
export class UpgradeComponent implements AfterViewInit, OnInit {
  errorMessage: string = '';
  countriesCode: any;
  credit_card: CreditCard = null;
  submitted: boolean = false;


  selected_plan: any = null;
  paymentMethod: string = 'credit';
  val1: any;

  private cookieOptionsArgs: CookieOptions = Constants.cookieOptionsArgs;

  constructor(
    private userService: UserService
  ) {}

  ngOnInit(): void {

  }

  ngAfterViewInit() {


  }

  changePaymentMethod(element: any) {
    this.paymentMethod = element.value;
  }

  onSubmit() {
    this.submitted = true;
  }

  openPaymentMethodModal() {

  }

}
