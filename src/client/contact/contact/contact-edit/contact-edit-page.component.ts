import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Contact } from '../contact.model';
import { ZContactService } from '../../shared/services/contact.service';

@Component({
  moduleId: module.id,
  selector: 'contact-edit-page',
  templateUrl: 'contact-edit-page.component.html'
})
export class ContactEditPageComponent implements OnInit {

  contact: Contact;

  constructor(private contactService: ZContactService,
              private router: Router,
              private route: ActivatedRoute
  ) {
  }

  ngOnInit() {

    this.route.params.subscribe((params: any) => {
      let id = params['id'];

      if (id === undefined || id === 'new') {
        this.contact = new Contact(
          {
            phones: [{
              category: 'mobile',
            }],
            emails: [{
              category: 'work',
            }],

            addresses: [{
              category: 'work',
            },
              {
                category: 'home',
              }],
            social_media: [{
              category: 'wthapps',
            }]
          }
        );
        console.log('this.conatct::::', this.contact);
      } else {
        this.get(id);
      }
      });
  }

  doEvent(event: any) {
    console.log('doing event::::', event);
  }

  private get(id: number) {
    this.contactService.get(id).subscribe((response: any) => {
      this.contact = new Contact(response.data);
      console.log('this contact::::', this.contact);
    });
  }
}
