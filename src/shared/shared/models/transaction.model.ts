import { BillingAddress } from './billing-address.model';
import { Customer }       from './customer.model';
import { CreditCard }     from './credit-card.model';

export class Transaction {
  constructor(public company: string,
              public amount: any,
              public currency_iso_code: string,
              public status: string,
              public created_at: Date,
              public updated_at: Date,
              public billing_address: BillingAddress,
              public credit_card: CreditCard,
              public customer: Customer) {
  }
}
