import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

import { CreditCard } from '@wth/shared/shared/models/credit-card.model';

import { UserService } from '@wth/shared/services/user.service';
import { ToastsService } from '@wth/shared/shared/components/toast/toast-message.service';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';
import { PaymentMethodAddModalComponent } from './payment-method-add-modal.component';
import { ApiBaseService } from '@shared/services';

@Component({
  selector: 'payment-method-list',
  templateUrl: 'payment-method-list.component.html',
  styleUrls: ['payment-method-list.component.scss']
})

export class PaymentMethodListComponent implements OnInit, AfterViewInit {
  @ViewChild('addModal') addModal: PaymentMethodAddModalComponent;
  pageTitle = 'Payment methods';
  credit_card: CreditCard;
  paymentMethod: any;
  paymentMethods: Array<any> = [];
  loaded = false;

  constructor(public userService: UserService,
              private wthConfirmService: WthConfirmService,
              private toastsService: ToastsService,
              private apiBaseService: ApiBaseService) {
  }

  ngOnInit(): void {

    // Get current payment methods
    this.apiBaseService.get('account/payment_methods')
      .subscribe(response => {
        this.paymentMethod = response.data[0];
        this.loaded = true;
      });
  }


  ngAfterViewInit() {
    // this.openModal();
  }

  openModal(paymentMethod: any = null) {
    const mode = paymentMethod ? 'edit' : 'add';

    this.apiBaseService.get('account/payment_methods/new')
      .subscribe(response => {
        if (mode === 'edit') {
          this.paymentMethod = paymentMethod;
          this.paymentMethod.generation_time = response.data.generation_time;
        } else if (mode === 'add') {
          this.paymentMethod = response.data;
        }
        this.addModal.open({data: this.paymentMethod, mode: mode});
      });

  }

  /** Depending on mode that we will create or update payment method
   * add: create:
   * edit: update
   */
  savePaymentMethod(payload: any) {
    if (payload.mode === 'add') {
      this.create(payload.paymentMethod);
    } else if (payload.mode === 'edit') {
      this.update(payload.paymentMethod);
    }
  }

  create(paymentMethod: any): void {
    this.apiBaseService.post('account/payment_methods', paymentMethod)
      .subscribe(response => {
        this.paymentMethods.push(response.data);
        this.toastsService.success('You added payment method successfully');
        this.addModal.close();
      }, response => {
        this.toastsService.danger(`${response.error.message}`);
      });
  }

  update(paymentMethod: any): void {
    this.apiBaseService.patch(`account/payment_methods/${paymentMethod.uuid}`, {paymentMethod: paymentMethod}).subscribe(
      response => {
        this.toastsService.success('You updated payment method successfully');
        this.paymentMethod = response.data;
        this.addModal.close();
      },
      error => {
        this.toastsService.danger('Can not update payment method');
      }
    );
  }

  setDefault(paymentMethod: any, radio: any): void {
    radio.preventDefault();

    if (paymentMethod.default) {
      return;
    }

    this.wthConfirmService.confirm({
      message: 'Are you sure you want to change default payment method',
      header: 'Set Default Payment Method',
      accept: () => {
        this.apiBaseService.patch(`account/payment_methods/${paymentMethod.uuid}`, {
          paymentMethod: {uuid: paymentMethod.uuid, default: !paymentMethod.default}
        }).subscribe(
          response => {
            radio.target.checked = true;
            this.toastsService.success('You changed default payment method successfully');
            this.paymentMethods.map(p => {
              p.default = (p.uuid === paymentMethod.uuid) ? true : false;
            });
          },
          error => {
            this.toastsService.danger('Can not changed default payment method');
          }
        );
      },
      reject: () => {
        radio.target.checked = false;
      }
    });
  }

  delete(paymentMethod: any): void {

    this.wthConfirmService.confirm({
      message: 'Are you sure you want to delete payment method?',
      header: 'Delete Payment Method',
      accept: () => {
        this.apiBaseService.delete(`account/payment_methods/${paymentMethod.uuid}`).subscribe(
          response => {
            this.paymentMethods = this.paymentMethods.filter(p => p.uuid !== paymentMethod.uuid);
            this.toastsService.success('You deleted payment method successfully');
          },
          error => {
            this.toastsService.danger('Can not delete payment method');
          }
        );
      }
    });
  }
}
