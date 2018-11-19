import { Component, Input, ViewChild, OnInit, Output, EventEmitter } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray, AbstractControl, FormControl
} from '@angular/forms';

import { Observable } from 'rxjs';

import { BsModalComponent } from 'ng2-bs3-modal';
import { ProfileService } from '../profile/profile.service';
import { Constants } from '../../../constant/config/constants';
import { CountryService } from '../../../shared/components/countries/countries.service';

declare var _: any;

@Component({
  selector: 'w-user-basic-info',
  templateUrl: 'basic-info.component.html'
})

export class BasicInfoComponent implements OnInit {
  @ViewChild('modal') modal: BsModalComponent;
  @Input() data: any;
  @Input() editable: boolean;
  @Output() outEvent: EventEmitter<any> = new EventEmitter<any>();

  constants = Constants;

  form: FormGroup;
  first_name: AbstractControl;
  last_name: AbstractControl;
  nickname: AbstractControl;

  about: AbstractControl;
  company: AbstractControl;
  occupation: AbstractControl;
  sex: AbstractControl;
  tag_line: AbstractControl;
  description: AbstractControl;
  birthday: AbstractControl;
  nationality: AbstractControl;
  countries$: Observable<any>;

  constructor(private fb: FormBuilder,
              private profileService: ProfileService,
              private countryService: CountryService) {
    this.form = fb.group({
      about: ['', Validators.maxLength(500)],
      company: ['', Validators.maxLength(100)],
      occupation: ['', Validators.maxLength(100)],
      sex: [''],
      birthday: [''],
      nationality: ['']
    });

    this.about = this.form.controls['about'];
    this.company = this.form.controls['company'];
    this.occupation = this.form.controls['occupation'];
    this.sex = this.form.controls['sex'];
    this.birthday = this.form.controls['birthday'];
    this.nationality = this.form.controls['nationality'];
  }

  ngOnInit() {
    this.countries$ = this.countryService.getCountries();
  }


  onOpenModal() {
    // console.log(this.data);

    (<FormControl>this.about).setValue(this.data.about);
    (<FormControl>this.company).setValue(this.data.company);
    (<FormControl>this.occupation).setValue(this.data.occupation);
    (<FormControl>this.sex).setValue(this.data.sex);
    (<FormControl>this.birthday).setValue(new Date(this.data.birthday || null).toISOString().split('T')[0]);
    (<FormControl>this.nationality).setValue(this.data.nationality);

    this.modal.open();
  }

  getCountryName(countries: Array<any>, code: any): any {
    let result = null;
    if (countries && countries.length > 0) {
      countries.forEach(c => {
        if (c.code === code) {
          result = c;
          return;
        }
      });
    }
    return result ? result.name : null;
  }

  onSubmit(values: any): void {

    const body = {
      about: values.about,
      company: values.company,
      occupation: values.occupation,
      birthday: values.birthday,
      nationality: values.nationality,
      sex: values.sex
    };

    this.profileService.updateMyProfile(body).subscribe((res: any) => {
      this.data = res.data;
      this.outEvent.emit(res.data);
      this.modal.close();
    });
  }
}
