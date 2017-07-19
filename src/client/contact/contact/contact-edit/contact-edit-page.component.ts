import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Contact } from '../contact.model';
import { ZContactService } from '../../shared/services/contact.service';
import { ToastsService } from '../../../core/partials/toast/toast-message.service';

@Component({
  moduleId: module.id,
  selector: 'contact-edit-page',
  templateUrl: 'contact-edit-page.component.html'
})
export class ContactEditPageComponent implements OnInit {

  contact: Contact = new Contact({
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
  mode: string ='view';
  pageTitle: string;

  constructor(
    private router: Router,
    private contactService: ZContactService,
    private route: ActivatedRoute,
    private toastsService: ToastsService,

  ) {
  }

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      let id = params['id'];
      if(params['mode'] !== undefined) {
        this.mode = params['mode'];
      } else {
        this.mode = 'create';
      }

      if (id !== undefined && id !== 'new') {
        this.get(id);
      }
    });

    if(this.mode === 'view') {
      this.pageTitle = 'Contact details';
    } else if(this.mode == 'create') {
      this.pageTitle = 'Create contact'
    } else {
      this.pageTitle = 'Edit contact';
    }
  }

  doEvent(event: any) {
    console.log('doing event::::', event, event.payload.item);

    switch(event.action) {
      case 'contact:contact:create':
        this.contactService.create(event.payload.item).subscribe((response: any) => {
          this.toastsService.success('Contact has been just created successfully!');
        });
        break;
      case 'contact:contact:update':
        this.contactService.update(event.payload.item).subscribe((response: any) => {
          this.toastsService.success('Contact has been just updated successfully!');
        });
        break;
    }
  }

  gotoEdit() {
    this.router.navigate(['/contacts', this.contact.id, {mode:'edit'}]);
    this.pageTitle = 'Edit contact';
  }

  private get(id: number) {
    this.contactService.get(id).subscribe((response: any) => {
      this.contact = response.data;
    });
  }
}
