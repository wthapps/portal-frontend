export class CreditCard {
  constructor(
    public masked_number: string,
    public last_4: string,
    public cardholder_name: string,
    public card_type: string
  ){}
}
