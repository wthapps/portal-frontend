import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ApiBaseService } from '@shared/services';
import { BsModalComponent } from 'ng2-bs3-modal';
import { ZContactService } from '@contacts/shared/services/contact.service';
import { Subject } from 'rxjs/Subject';


@Component({
  selector: 'z-contact-shared-setting',
  templateUrl: 'settings.component.html'
})

export class ZContactSharedSettingsComponent implements OnInit, OnDestroy {
  @ViewChild('modal') modal: BsModalComponent;
  item: any;
  form: FormGroup;
  phone_default_code: AbstractControl;

  private destroySubject: Subject<any> = new Subject();

  constructor(private fb: FormBuilder,
              private contactService: ZContactService,
              private apiBaseService: ApiBaseService) {
    // Init default
    this.form = this.fb.group({
      'phone_default_code': ['Albania (+355)']
    });

    this.phone_default_code = this.form.controls['phone_default_code'];
  }

  ngOnInit() {
    this.apiBaseService.get(`contact/wcontacts/settings`).subscribe((res: any) => {
      if (res.data && res.data.phone_default_code) {
        (<FormControl>this.phone_default_code).setValue(res.data.phone_default_code);
      }
    });
  }

  ngOnDestroy() {
    this.destroySubject.next('');
    this.destroySubject.complete();
  }

  onCompleteChange(country: string) {
    (<FormControl>this.phone_default_code).setValue(country);
  }

  submit(value: any) {
    this.apiBaseService.post(`contact/wcontacts/update_settings`, { contact_setting_attributes: value })
      .subscribe((res: any) => {
        console.log('settings', res);
      });
    this.modal.close();
  }

  open() {
    this.modal.open();
  }
}
