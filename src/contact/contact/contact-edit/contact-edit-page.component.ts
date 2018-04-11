import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Contact } from '../contact.model';
import { ZContactService } from '../../shared/services/contact.service';
import { ToastsService } from '../../../shared/shared/components/toast/toast-message.service';
import { Constants } from '../../../shared/constant/config/constants';
import { ZContactEditComponent } from '@contacts/contact/contact-edit/contact-edit.component';
// import { ZContactEditComponent } from './contact-edit.component';

@Component({
  moduleId: module.id,
  selector: 'contact-edit-page',
  templateUrl: 'contact-edit-page.component.html'
})
export class ZContactEditPageComponent implements OnInit {
  @ViewChild('contactEdit') contactEdit: ZContactEditComponent;

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
  mode: string = 'view';
  pageTitle: string;

  tooltip: any = Constants.tooltip;

  constructor(private router: Router,
              private contactService: ZContactService,
              private route: ActivatedRoute,
              private toastsService: ToastsService) {
  }

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      let id = params['id'];
      if (params['mode'] !== undefined) {
        this.mode = params['mode'];
      } else {
        this.mode = 'create';
      }

      if (id !== undefined && id !== 'new') {
        this.get(id);
      }
    });

    if (this.mode === 'view') {
      this.pageTitle = 'Contact details';
    } else if (this.mode == 'create') {
      this.pageTitle = 'Create contact';
    } else {
      this.pageTitle = 'Edit contact';
    }
  }

  doEvent(event: any) {
    console.log('doing event::::', event.payload.item);

    switch (event.action) {
      case 'contact:contact:create':
        this.contactService.create(event.payload.item).subscribe((response: any) => {
          console.log(response);
          this.toastsService.success('Contact has been just created successfully!');
          this.router.navigate(['/contacts/detail', response.data.id]);
        });
        break;
      case 'contact:contact:update':
        this.contactService.update(event.payload.item).subscribe((response: any) => {
          console.log(response);
          this.toastsService.success('Contact has been just updated successfully!');
          this.router.navigate(['/contacts/detail', response.data.id]);
        });
        break;
    }
  }

  gotoEdit() {
    this.router.navigate(['/contacts', this.contact.id, {mode: 'edit'}]);
    this.pageTitle = 'Edit contact';
  }

  private get(id: number) {
    this.contactService.get(id).subscribe((response: any) => {
      this.contact = response.data;
    });
  }
}
