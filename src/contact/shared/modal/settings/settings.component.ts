import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ApiBaseService } from '@shared/services';
import { BsModalComponent } from 'ng2-bs3-modal';


@Component({

  selector: 'z-contact-shared-setting',
  templateUrl: 'settings.component.html'
})

export class ZContactSharedSettingsComponent implements OnInit {
  @ViewChild('modal') modal: BsModalComponent;
  item: any;
  form: FormGroup;
  phone_default_code: AbstractControl;

  constructor(private fb: FormBuilder,
              private apiBaseService: ApiBaseService) {
    // Init default
    this.form = this.fb.group({
      'phone_default_code': ['Albania (+355)']
    });

    this.phone_default_code = this.form.controls['phone_default_code'];
  }

  ngOnInit() {
    this.apiBaseService.get(`contact/contacts/settings`).subscribe((res: any) => {
      if (res.data && res.data.phone_default_code) {
        (<FormControl>this.phone_default_code).setValue(res.data.phone_default_code);
      }
    });
  }

  onCompleteChange(country: string) {
    (<FormControl>this.phone_default_code).setValue(country);
  }

  submit(value: any) {
    this.apiBaseService.post(`contact/contacts/update_settings`, { contact_setting_attributes: value })
      .subscribe((res: any) => {
        console.log('settings', res);
      });
    this.modal.close();
  }

  open() {
    this.modal.open();
  }
}
