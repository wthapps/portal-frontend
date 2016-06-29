export class BillingAddress {
  constructor(
    public street_address: string,
    public extended_address: string,
    public postal_code: string,
    public region: string,
    public country_name: string
  ){}
}
