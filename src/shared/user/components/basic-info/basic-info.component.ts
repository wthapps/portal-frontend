import { Component, Input, ViewChild, OnInit, Output, EventEmitter } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray, AbstractControl, FormControl
} from '@angular/forms';

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
  @Input('data') data: any;
  @ViewChild('modal') modal: BsModalComponent;
  @Input() editable: boolean;
  @Output() outEvent: EventEmitter<any> = new EventEmitter<any>();

  constants = Constants;
  countriesCode: any;

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
  birthday_day: AbstractControl;
  birthday_month: AbstractControl;
  birthday_year: AbstractControl;
  nationality: AbstractControl;

  constructor(private fb: FormBuilder,
              private profileService: ProfileService,
              private countryService: CountryService) {
    this.form = fb.group({
      about: [''],
      company: [''],
      occupation: [''],
      sex: [''],
      birthday_day: [''],
      birthday_month: [''],
      birthday_year: [''],
      nationality: ['']
    });

    this.about = this.form.controls['about'];
    this.company = this.form.controls['company'];
    this.occupation = this.form.controls['occupation'];
    this.sex = this.form.controls['sex'];
    this.birthday_day = this.form.controls['birthday_day'];
    this.birthday_month = this.form.controls['birthday_month'];
    this.birthday_year = this.form.controls['birthday_year'];
    this.nationality = this.form.controls['nationality'];
  }

  ngOnInit() {
    this.countryService.getCountries().subscribe(
      (data: any) => {
        this.countriesCode = data;
      });
  }


  onOpenModal() {
    // console.log(this.data);

    (<FormControl>this.about).setValue(this.data.about);
    (<FormControl>this.sex).setValue(this.data.sex);

    // console.log(this.data.birthday);

    if (this.data.birthday !== null) {
      let birthday = new Date(this.data.birthday);
      (<FormControl>this.birthday_day).setValue(birthday.getDate());
      (<FormControl>this.birthday_month).setValue(birthday.getMonth() + 1);
      (<FormControl>this.birthday_year).setValue(birthday.getUTCFullYear());
    }

    (<FormControl>this.nationality).setValue(this.data.nationality);

    this.modal.open();
  }

  onSubmit(values: any): void {
    console.log(values);
    let birthday = new Date(values.birthday_year, values.birthday_month - 1, values.birthday_day);

    let body = {
      about: values.about,
      company: values.company,
      occupation: values.occupation,
      birthday: birthday,
      nationality: values.nationality,
      sex: values.sex
    };

    this.profileService.updateMyProfile(body).subscribe((res: any) => {
      this.data = res.data;
      this.outEvent.emit(res.data);
      console.log(res);
      this.modal.close();
    });
  }
}
