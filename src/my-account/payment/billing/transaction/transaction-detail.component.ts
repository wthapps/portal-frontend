import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { UserService } from '@shared/services/user.service';
import { TransactionService } from './transaction.service';
import { LoadingService } from '@shared/shared/components/loading/loading.service';

import * as printJs from 'print-js';

@Component({
  selector: 'my-transaction-detail',
  templateUrl: 'transaction-detail.component.html'
})

export class TransactionDetailComponent implements OnInit {
  pageTitle: string = 'Transaction Details';
  transaction: any = {
    amount: 0,
    merchant: '',
    currency_iso_code: '',
    created_at: new Date(),
    updated_at: '',
    status: '',
    type: '',
    payment_instrument_type: '',
    billing_address: {
      street_address: '',
      extended_address: '',
      region: '',
      postal_code: '',
      locality: '',
      country_name: ''
    },
    customer: {
      firt_name: '',
      last_name: '',
      email: ''
    },
    credit_card: {
      last_4: '',
      card_type: '',
      cardholder_name: ''
    }
  };
  trans_id: string = '';

  constructor(private userService: UserService,
              private route: ActivatedRoute,
              private transactionService: TransactionService,
              private loadingService: LoadingService,
              private router: Router) {
  }

  ngOnInit(): void {

    this.route.params.subscribe((params) => {
      this.trans_id = params['id'];
    });

    // this.loadingService.start();
    this.transactionService.get(this.trans_id).subscribe(
      (response: any) => {
        this.transaction = response.data;
        // this.loadingService.stop();
      },
      (error: any) => {
        console.log('Receipt error', error);
        this.loadingService.stop();
      });
  }

  printTransaction(): void {
    printJs({
      printable: 'print-section',
      type: 'html',
      style: `
        body {
          font-family: "Lato", "Helvetica Neue", Helvetica, Arial, sans-serif;
          font-size: 14px;
          line-height: 1.42857143;
          color: #4a4a4a;
        }
        h4 {
          font-size: 18px;
          margin-top: 10px;
          margin-bottom: 10px;
        }
        .card-line {
          clear: both;
          margin: 10px -10px;
          margin-top: 20px;
          margin-bottom: 20px;
          border: 0;
          border-top: 1px solid #eeeeee
        }
        dl {
          margin-top: 0;
          margin-bottom: 20px; 
          display: block;
          margin-block-start: 1em;
          margin-block-end: 1em;
          margin-inline-start: 0px;
          margin-inline-end: 0px;
        }
        dt {
            font-weight: bold;
        }
        .dl-horizontal dt {
          float: left;
          width: 160px;
          clear: left;
          text-align: right;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .dl-horizontal dd {
          margin-left: 180px;
        }
      `
    });
  }
}
