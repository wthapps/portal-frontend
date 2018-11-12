import { ContactNamePipe } from './contact-name.pipe';
import { Contact } from '../../contact/contact.model';

describe('ContactNamePipe', () => {
  // This pipe is a pure, stateless function so no need for BeforeEach
  const pipe = new ContactNamePipe();
  const first_name = 'An';
  const last_name = 'Vo';
  const contact = new Contact();
  contact.name = first_name;
  contact.family_name = last_name;

  it('transforms contact by first name  to "An Vo"', () => {
    expect(pipe.transform(contact, 'first_name')).toBe(
      `${first_name} ${last_name}`
    );
  });

  it('transforms contact by first name  to "Vo An"', () => {
    expect(pipe.transform(contact, 'last_name')).toBe(
      `${last_name}, ${first_name}`
    );
  });
});
