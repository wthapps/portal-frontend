import { Component, OnInit, Input, Output, EventEmitter, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { HdModalComponent } from '../../ng2-hd/modal/components/modal';

import {
  FormGroup,
  AbstractControl,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';
import { UserService } from '../../../../shared/services/user.service';
import { ApiBaseServiceV2 } from '../../../../shared/services/apibase.service.v2';
import { LoadingService } from '../../../../partials/loading/loading.service';

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'page-zone-form-report-member',
  templateUrl: 'post.component.html',
})


export class ZPictureFormReportMemberComponent implements OnInit, OnChanges {

  @ViewChild('modal') modal: HdModalComponent;
  @Input('data') uuid: string;

  errorMessage: string = '';

  form: FormGroup;
  other: AbstractControl;


  constructor(private fb: FormBuilder,
              private apiBaseServiceV2: ApiBaseServiceV2,
              private loadingService: LoadingService,
              private userService: UserService) {

    this.form = fb.group({
      'other': ['']
    });

    this.other = this.form.controls['other'];
  }

  ngOnInit() {

  }

  ngOnChanges() {
    if (this.uuid) {
      console.log(this.uuid);
    }
  }

  getValue(value: any): any {
    console.log(value);
    return value;
  }

  onSubmit(values: any): void {
    console.log(values);

    let body = JSON.stringify({
      report_member_level: values.report_member_level,
      other: values.other
    });
    console.log(body);
    this.apiBaseServiceV2.put(`zone/social_network/communities/${this.data.uuid}`, body)
      .subscribe((result: any) => {
          console.log(result);
        },
        error => {
          console.log(error);
        }
      );

    this.modal.close();
  }

}
