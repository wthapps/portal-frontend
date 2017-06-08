import { Component, Input, ViewChild, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray, AbstractControl, FormControl
} from '@angular/forms';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { PartialsProfileService } from '../profile.service';
import { Constants } from '../../../shared/config/constants';
import { CountryService } from '../../countries/countries.service';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'partials-profile-about',
  templateUrl: 'about.component.html'
})

export class PartialsProfileAboutComponent implements OnInit {
  @Input('data') data: any;
  @ViewChild('modal') modal: ModalComponent;

  constants = Constants;
  countriesCode: any;

  form: FormGroup;
  first_name: AbstractControl;
  last_name: AbstractControl;
  nickname: AbstractControl;
  about: AbstractControl;
  gender: AbstractControl;
  tag_line: AbstractControl;
  description: AbstractControl;
  birthday_day: AbstractControl;
  birthday_month: AbstractControl;
  birthday_year: AbstractControl;
  nationality: AbstractControl;

  constructor(private fb: FormBuilder,
              private profileService: PartialsProfileService,
              private countryService: CountryService) {
    this.form = fb.group({
      'about': [''],
      'gender': [''],
      'birthday_day': [''],
      'birthday_month': [''],
      'birthday_year': [''],
      'nationality': ['']
    });

    this.about = this.form.controls['about'];
    this.gender = this.form.controls['gender'];
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
    console.log(this.data);

    (<FormControl>this.about).setValue(this.data.basic_info.about);
    (<FormControl>this.gender).setValue(this.data.basic_info.sex);

    console.log(this.data.basic_info.birthday);

    if (this.data.basic_info.birthday !== null) {
      let birthday = new Date(this.data.basic_info.birthday);
      (<FormControl>this.birthday_day).setValue(birthday.getDate());
      (<FormControl>this.birthday_month).setValue(birthday.getMonth() + 1);
      (<FormControl>this.birthday_year).setValue(birthday.getUTCFullYear());
    }

    (<FormControl>this.nationality).setValue(this.data.basic_info.nationality);

    this.modal.open();
  }

  onSubmit(values: any): void {
    console.log('values:', values);

    let birthday = new Date(values.birthday_year, values.birthday_month, values.birthday_day);

    let body = JSON.stringify({
      basic_info: {
        about: values.about,
        birthday: birthday,
        nationality: values.nationality,
        sex: values.sex
      }
    });

    console.log(body);

    this.profileService.updateMyProfile(body).subscribe((res: any) => {
      this.data = res.data;
      console.log(res);
      // (<FormControl>this.contact_note).setValue(this.data.contact_note);
      this.modal.close();
    });
  }
}
