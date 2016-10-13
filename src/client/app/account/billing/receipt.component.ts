import {
  Component,
  OnInit,
  ElementRef
}                                                   from '@angular/core';
import { Router, ActivatedRoute }  from '@angular/router';
import { UserService,
  //2 LoadingService
}                from '../../shared/index';
import { TransactionService }                         from '../transaction.service';

declare var $: any;

@Component({
  moduleId: module.id,
  templateUrl: 'receipt.component.html',
  providers: [
    TransactionService
    //2 , LoadingService
  ],
  styleUrls: ['receipt.component.css']
})

export class ReceiptComponent implements OnInit {
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
              private router: Router,
              private route: ActivatedRoute,
              private transactionService: TransactionService,
              //2 private loadingService: LoadingService,
              private _el: ElementRef) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
        this.trans_id = params['id'];
      }
    );

    //2 this.loadingService.start();
    this.transactionService.list(`users/${this.userService.profile.id}/transactions/${this.trans_id}`)
      .subscribe((response: any) => {
          this.transaction = response.data;
          this.transaction.created_at = new Date(response.data.created_at);
          //2 this.loadingService.stop();
        },
        error => {
          console.log('Receipt error', error);
          //2 this.loadingService.stop();
        });
  }

  printOut(): void {
    //console.log(this.printOut);
    let html = $(this._el.nativeElement).find('#printOut').html();
    //var mywindow = window.open('', 'printOut', 'height=400,width=600');
    var mywindow = window.open('', '_blank');
    mywindow.document.write('<html><head><title></title>');
    /*optional stylesheet*/ //mywindow.document.write('<link rel="stylesheet" href="main.css" type="text/css" />');
    mywindow.document.write('</head><body >');
    mywindow.document.write(html);
    mywindow.document.write('</body></html>');

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10

    mywindow.print();
    mywindow.close();
    //console.log($(this._el.nativeElement).find('.printOut'));
  }
}
