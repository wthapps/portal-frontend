import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Subject } from 'rxjs/Subject';

import { Constants } from '../../../config/constants';
import { CustomValidator } from '../../../validator/custom.validator';
import { UserService } from '../../../services/user.service';
import { CommonEventService } from '../../../services/common-event/common-event.service';
import { LoadingService } from '../../loading/loading.service';
import { ToastsService } from '../../toast/toast-message.service';
import { AddressModel, EmailModel, PhoneModel, ProfileModel } from '../../../models/profile/profile.model';

declare let _: any;

@Component({
  moduleId: module.id,
  selector: 'partials-basic-info',
  templateUrl: 'basic-info.component.html',
  styleUrls: ['basic-info.component.css']
})

export class PartialsBasicInfoComponent implements OnInit, OnDestroy {
  @Input('data') data: ProfileModel;
  @Input() mode: string = 'create';
  @Output() event: EventEmitter<any> = new EventEmitter<any>();

  destroySubject: Subject<any> = new Subject<any>();

  avatarDefault: string = Constants.img.avatar;
  deleteObjects: any = {};

  phoneCategories: Array<any> = Constants.phoneCategories;
  emailCategories: Array<any> = Constants.emailCategories;
  addressCategories: Array<any> = Constants.addressCategories;

  form: FormGroup;
  name: AbstractControl;
  company: AbstractControl;
  labels: AbstractControl;
  job_title: AbstractControl;
  notes: AbstractControl;

  filteredLabelsMultiple: any = [];
  originalLabels: Object[];
  disableEdit: boolean = true;

  constructor(private fb: FormBuilder,
              private commonEventService: CommonEventService,
              private userService: UserService,
              private loadingService: LoadingService,
              private toastsService: ToastsService) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      'company': [''],
      'job_title': [''],

      'phones': this.fb.array([
        this.initItem('phones'),
      ]),
      'emails': this.fb.array([
        this.initItem('emails'),
      ]),
      'addresses': this.fb.array([
        this.initItem('addresses'),
      ])
    });

    this.company = this.form.controls['company'];
    this.job_title = this.form.controls['job_title'];
  }

  ngOnDestroy() {
    this.destroySubject.next('');
    this.destroySubject.unsubscribe();
  }

  removeAll(controls: string[] = ['phones', 'emails', 'addresses']) {
    _.map(controls, (v: string) => {
      const control = <FormArray>this.form.controls[v];
      control.controls.length = 0;
      control.reset();
    });

  }

  //emails
  initItem(type: string, item?: any) {
    let data: any = null;
    let fbGroup: any = null;

    switch (type) {
      case 'phones':
        data = item ? item : new PhoneModel();
        fbGroup = this.fb.group({
          category: [data.category, Validators.compose([Validators.required])],
          country_alpha_code: [data.country_alpha_code],
          id: [data.id, Validators.compose([Validators.required])],
          value: [data.value, Validators.compose([Validators.required, CustomValidator.phoneFormat])]
        });
        break;
      case 'emails':
        data = item ? item : new EmailModel();
        fbGroup = this.fb.group({
          id: [data.id, Validators.compose([Validators.required])],
          category: [data.category, Validators.compose([Validators.required])],
          value: [data.value, Validators.compose([CustomValidator.emailFormat])]
        });
        break;
      case 'addresses':
        data = item ? item : new AddressModel();
        fbGroup = this.fb.group({
          id: [data.id, Validators.compose([Validators.required])],
          category: [data.category, Validators.compose([Validators.required])],
          address_line1: [data.address_line1, Validators.compose([Validators.required])],
          po_box: [data.po_box],
          city: [data.city],
          province: [data.province],
          postcode: [data.postcode],
          country: [data.country]
        });
        break;
      default:
        break;
    }

    return fbGroup;
  }

  addItem(type: string, item: any = null) {
    const control = <FormArray>this.form.controls[type];
    control.push(this.initItem(type, item));
  }

  removeItem(type: string, i: number) {
    const control = <FormArray>this.form.controls[type];
    control.removeAt(i);
  }

  onSubmit(values: any): void {

  }


  changeProfileImage(): void {
    this.commonEventService.broadcast({
      channel: 'SELECT_CROP_EVENT',
      action: 'SELECT_CROP:OPEN',
      payload: this.userService.profile.profile_image
    });
    this.handleSelectCropEvent();
  }

  handleSelectCropEvent() {
    this.commonEventService.filter((event: any) => event.channel == 'SELECT_CROP_EVENT')
      .takeUntil(this.destroySubject)
      .subscribe((event: any) => {
        this.doEvent(event);
      });
  }


  doEvent(event: any) {
    // console.log(event);
    switch (event.action) {
      case 'SELECT_CROP:DONE':
        console.debug('inside doEvent - SELECT_CROP:DONE', event);
        // Change user profile
        this.updateProfileImageBase64(event.payload);
        break;
      default:
        break;
    }
  }

  updateProfileImageBase64(img: string): void {
    this.updateUser(JSON.stringify({image: img}));
  }

  private updateUser(body: string): void {
    // this.apiBaseService.put('zone/social_network/users/update', body)
    this.userService.update(`users/${this.userService.profile.id}`, body)
      .subscribe((result: any) => {
          // stop loading
          this.loadingService.stop();
          this.toastsService.success(result.message);
        },
        error => {
          // stop loading
          this.loadingService.stop();
          this.toastsService.danger(error);
          console.log(error);
        }
      );
  }
}
