import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ApiBaseService } from '@shared/services';
import { BsModalComponent } from 'ng2-bs3-modal';
import { ZContactService } from '@contacts/shared/services/contact.service';
import { Subject } from 'rxjs/Subject';


@Component({
  selector: 'z-contact-shared-setting',
  templateUrl: 'settings.component.html',
  styleUrls: ['settings.component.scss']
})

export class ZContactSharedSettingsComponent implements OnInit, OnDestroy {
  @ViewChild('modal') modal: BsModalComponent;
  item: any;
  form: FormGroup;
  phone_default_code: AbstractControl;
  contacts_sort_by: AbstractControl;

  private destroySubject: Subject<any> = new Subject();

  constructor(private fb: FormBuilder,
              private contactService: ZContactService,
              private apiBaseService: ApiBaseService) {
    // Init default
    this.form = this.fb.group({
      'phone_default_code': ['Canada (+1)'],
      'contacts_sort_by': ['first_name']
    });

    this.phone_default_code = this.form.controls['phone_default_code'];
    this.contacts_sort_by = this.form.controls['contacts_sort_by'];
  }

  ngOnInit() {
    this.contactService.getSettings().subscribe((res: any) => {
      if (res.data && res.data.phone_default_code) {
        // (<FormControl>this.phone_default_code).setValue(res.data.phone_default_code);
        // (<FormControl>this.contacts_sort_by).setValue(res.data.contacts_sort_by);
        this.setFormValue(res.data);
      }
    });
  }

  ngOnDestroy() {
    this.destroySubject.next('');
    this.destroySubject.complete();
  }

  onCompleteChange(country: any) {
    (<FormControl>this.phone_default_code).setValue(country.value);
  }

  submit(value: any) {
    this.apiBaseService.post(`contact/wcontacts/update_settings`, { contact_setting_attributes: value })
      .subscribe((res: any) => {
        console.log('settings', res);
        this.contactService.setUserSettings(res.data);
      });
    this.modal.close();
  }

  resetSettings() {
    this.apiBaseService.post(`contact/wcontacts/reset_settings`)
      .subscribe((res: any) => {
        // (<FormControl>this.phone_default_code).setValue(res.data.phone_default_code);
        // (<FormControl>this.contacts_sort_by).setValue(res.data.contacts_sort_by);
        // this.contactService.setUserSettings(res.data);
        this.setFormValue(res.data);
      });
    // this.modal.close();
  }

  open() {
    this.modal.open();
  }

  private setFormValue(data) {
    (<FormControl>this.phone_default_code).setValue(data.phone_default_code);
    (<FormControl>this.contacts_sort_by).setValue(data.contacts_sort_by);
    this.contactService.setUserSettings(data);
  }
}
