export class BillingAddress {
  street_address: string;
  extended_address: string;
  locality: string;
  postcode: string;
  zipcode: string;
  region: string;
  country_code_alpha2: string;
  country_name: string;

  constructor(fields?: {
    street_address?: string,
    extended_address?: string,
    locality?: string,
    postcode?: string,
    zipcode?: string,
    region?: string,
    country_code_alpha2?: string,
    country_name?: string
  }) {
    if (fields) Object.assign(this, fields);
  }
}
