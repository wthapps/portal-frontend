export class Recipient {
  email: string = '';
  fullName: string = '';
  contactId: number = null;

  constructor(attributes: any={}) {
    if (attributes) {
      Object.assign(this, attributes);
    }
  }
}
