import {BillingAddress} from "./billing-address.model";
export class CreditCard {
  masked_number: string;
  last_4: string;
  cardholder_name: string;
  card_type: string;
  billing_address: BillingAddress;
  constructor(
    fields?: {
      masked_number?: string,
      last_4?: string,
      cardholder_name?: string,
      card_type?: string,
      billing_address?: BillingAddress
    }) {
    if (fields) Object.assign(this, fields);
  }
}
