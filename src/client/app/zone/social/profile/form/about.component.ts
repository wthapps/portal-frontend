import { Component, OnInit, OnChanges, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { ApiBaseService } from '../../../../shared/services/apibase.service';
import { UserService } from '../../../../shared/services/user.service';
import { LoadingService } from '../../../../partials/loading/loading.service';
import { HdModalComponent } from '../../../shared/ng2-hd/modal/components/modal';

import {
  FormGroup,
  AbstractControl,
  FormBuilder,
  Validators,
  FormControl,
  FormArray
} from '@angular/forms';
import { CustomValidator } from '../../../../shared/validator/custom.validator';
import { CountryService } from '../../../../partials/countries/countries.service';
import { SocialService } from '../../services/social.service';

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-social-profile-form-about',
  templateUrl: 'about.component.html'
})

export class ZSocialProfileFormAboutComponent implements OnInit, OnChanges {

  @ViewChild('modal') modal: HdModalComponent;
  @Input() data: any;
  @Input() action: string;
  @Output() updated: EventEmitter<any> = new EventEmitter<any>();

  errorMessage: string = '';
  list: any = [];
  maxLength: number = 0;
  currentUUID: string = '';

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
              private apiBaseService: ApiBaseService,
              private countryService: CountryService,
              private loadingService: LoadingService,
              private socialService: SocialService,
              private userService: UserService) {
    this.form = fb.group({
      'first_name': ['', Validators.compose([Validators.required])],
      'last_name': ['', Validators.compose([Validators.required])],
      'nickname': ['', Validators.compose([Validators.required])],
      'about': [''],
      'gender': [''],
      'tag_line': ['', Validators.maxLength(150)],
      'description': [''],
      'birthday_day': [''],
      'birthday_month': [''],
      'birthday_year': [''],
      'nationality': [''],
      'additional_links': fb.array([
        this.initLink(),
      ])
    });

    this.first_name = this.form.controls['first_name'];
    this.last_name = this.form.controls['last_name'];
    this.nickname = this.form.controls['nickname'];
    this.about = this.form.controls['about'];
    this.gender = this.form.controls['gender'];
    this.tag_line = this.form.controls['tag_line'];
    this.birthday_day = this.form.controls['birthday_day'];
    this.birthday_month = this.form.controls['birthday_month'];
    this.birthday_year = this.form.controls['birthday_year'];
    this.nationality = this.form.controls['nationality'];
  }

  ngOnInit() {
    this.removeAllLink();

    this.countryService.getCountries().subscribe(
      data => this.countriesCode = data,
      error => this.errorMessage = <any>error);

  }

  ngOnChanges() {
    this.removeAllLink();
    let _this = this;
    if (this.data && this.data.basic_info) {
      this.removeAllLink();

      (<FormControl>this.first_name).setValue(this.data.firstName);
      (<FormControl>this.last_name).setValue(this.data.lastName);
      (<FormControl>this.nickname).setValue(this.data.nickname);
      (<FormControl>this.about).setValue(this.data.basic_info.about);
      (<FormControl>this.gender).setValue(this.data.basic_info.sex);
      (<FormControl>this.tag_line).setValue(this.data.tag_line);

      if (this.data.basic_info !== null) {
        let birthday = new Date(this.data.basic_info.birthday);
        (<FormControl>this.birthday_day).setValue(birthday.getDate());
        (<FormControl>this.birthday_month).setValue(birthday.getMonth() + 1);
        (<FormControl>this.birthday_year).setValue(birthday.getUTCFullYear());
      }

      (<FormControl>this.nationality).setValue(this.data.basic_info.nationality);

      let additional_links_edit = this.data.basic_info.additional_links;
      _.map(additional_links_edit, (v: any)=> {
        _this.addLink(v);
      });
    }
  }

  onCheckLength(event: any) {
    $(event.target).closest('.form-group').find('.x-showLength').text(event.target.value.length);
  }


  initLink(link?: any) {

    if (link) {
      return this.fb.group({
        key: [link.name.toLowerCase().replace(' ', '_')],
        name: [link.name],
        url: [link.url, Validators.compose([CustomValidator.urlFormat])],
        order: [link.order]
      });
    } else {
      return this.fb.group({
        key: [''],
        name: [''],
        url: ['', Validators.compose([CustomValidator.urlFormat])],
        order: ['']
      });
    }
  }

  addLink(link?: any) {
    const control = <FormArray>this.form.controls['additional_links'];
    if (link) {
      control.push(this.initLink(link));
    } else {
      control.push(this.initLink());
    }

  }

  removeLink(i: number) {
    const control = <FormArray>this.form.controls['additional_links'];
    control.removeAt(i);
  }

  removeAllLink() {
    const control = <FormArray>this.form.controls['additional_links'];
    // console.log(control.length);
    for (let i = 0; i < control.length; i++) {
      control.removeAt(i);
      control.reset();
    }
  }

  onHideModal() {
    const control = <FormArray>this.form.controls['additional_links'];
    console.log(control);
    this.modal.close();
  }

  onSubmit(values: any): void {

    console.log(values);

    // get links if link is not empty
    let additional_links_filter: any = [];
    _.map(values.additional_links, (v: any)=> {
      if (v.url != '') {
        additional_links_filter.push(v);
      }
    });

    let body = JSON.stringify({
      first_name: values.firstName,
      last_name: values.lastName,
      nickname: values.nickname,
      about: values.about,
      sex: values.gender,
      tag_line: values.tag_line,
      birthday_day: values.birthday_day.toString(),
      birthday_month: values.birthday_month.toString(),
      birthday_year: values.birthday_year.toString(),
      nationality: values.nationality,
      additional_links: additional_links_filter
    });

    console.log('body:', body);

    this.apiBaseService.put(`zone/social_network/users/${this.data.uuid}`, body)
      .subscribe((result: any) => {
          console.log(result);
          this.updated.emit(result.data);
        },
        error => {
          console.log(error);
        }
      );

    this.modal.close();
  }
}
