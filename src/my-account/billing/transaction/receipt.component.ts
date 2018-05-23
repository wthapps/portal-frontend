import { Component, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MyTransactionService } from '../shared/transaction.service';
import { UserService } from '@wth/shared/services/user.service';
import { LoadingService } from '@wth/shared/shared/components/loading/loading.service';

declare var $: any;
@Component({
  moduleId: module.id,
  selector: 'my-transaction-receipt',
  templateUrl: 'receipt.component.html'
})

export class MyReceiptComponent implements OnInit {
  pageTitle: string = 'Receipt';
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
  trans_id: string;

  constructor(private userService: UserService,
              private route: ActivatedRoute,
              private transactionService: MyTransactionService,
              private loadingService: LoadingService,
              private _el: ElementRef) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
        this.trans_id = params['id'];
      }
    );

    this.loadingService.start();
    this.transactionService.detail(this.trans_id, this.userService.getSyncProfile().id).subscribe(
      (response: any) => {
        this.transaction = response.data;
        this.transaction.created_at = new Date(response.data.created_at);
        this.loadingService.stop();
      },
      (error: any) => {
        console.log('Receipt error', error);
        this.loadingService.stop();
      });
  }

  printOut(): void {
    // //console.log(this.printOut);
    // let html = $(this._el.nativeElement).find('#printOut').html();
    // //var mywindow = window.open('', 'printOut', 'height=400,width=600');
    // var mywindow = window.open('', '_blank');
    // mywindow.document.write('<html><head><title></title>');
    // /*optional stylesheet*/ //mywindow.document.write('<link rel="stylesheet" href="main.css" type="text/css" />');
    // mywindow.document.write('</head><body >');
    // mywindow.document.write(html);
    // mywindow.document.write('</body></html>');
    //
    // mywindow.document.close(); // necessary for IE >= 10
    // mywindow.focus(); // necessary for IE >= 10
    //
    // mywindow.print();
    // mywindow.close();
    //console.log($(this._el.nativeElement).find('.printOut'));
  }
}
