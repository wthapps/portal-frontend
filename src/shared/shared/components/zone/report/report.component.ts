import { Component, ViewChild } from '@angular/core';

import {
  FormGroup,
  AbstractControl,
  FormBuilder,
  FormControl
} from '@angular/forms';
import { ZSharedReportService } from './report.service';
import { BsModalComponent } from 'ng2-bs3-modal';

declare var $: any;
declare var _: any;

@Component({
    selector: 'wth-zone-report',
  templateUrl: 'report.component.html'
})
export class ZSharedReportComponent {
  @ViewChild('modal') modal: BsModalComponent;

  REASONS: Array<any> = [
    {id: 1, description: 'Spam or Scam', entity: 'post;community'},
    {id: 2, description: 'Hate Speech or Personal Harassment', entity: 'post;community;member;friend'},
    {id: 3, description: 'Inappropriate content or Fail Information', entity: 'post;member;community'},
    {id: 4, description: 'Adult content without marked “Adult content”', entity: 'post'},
    {id: 4, description: 'Duplicate, fake or misleading', entity: 'community'},
    {id: 1, description: 'Fake Account or Impersonating', entity: 'member;friend'},
    {id: 99, description: 'Other', entity: 'member;post;community;friend'}
  ];

  reasons: Array<any> = [];
  uuid: string = '';
  entityType: string = '';
  reason: any = {id: 0, description: ''};
  errorMessage: string = '';

  form: FormGroup;
  other: AbstractControl;

  constructor(private fb: FormBuilder,
              private reportService: ZSharedReportService) {

    this.form = fb.group({
      'other': ['']
    });

    this.other = this.form.controls['other'];

    this.reportService.set = this.activate.bind(this);
  }

  activate(type: string, uuid: string) {
    let promise = new Promise<boolean>((resolve, reject) => {
      this.show(type, uuid);
    });
    return promise;
  }

  getValue(reason: any = {id: 0, description: ''}): any {
    this.reason = reason;
    return this.reason;
  }

  onSubmit(values: any): void {
    let body = JSON.stringify({
      object_id: this.uuid,
      entity: this.entityType == 'post' ? 1 : this.entityType == 'member' ? 2 : 3,
      reports: [{id: this.reason.id, description: this.reason.id == 99 ? values.other : this.reason.description}]
    });
    // this.apiBaseService.post(`zone/social_network/userreports`, body)
    this.reportService.report(body)
      .subscribe((result: any) => {
          console.log(result);
        },
        error => console.log(error)
      );
    this.modal.close();
  }

  private show(type: string, uuid: string) {
    (<FormControl>this.other).setValue('');

    this.uuid = uuid;
    this.entityType = type;
    // this.reason     = {id: 0, description: ''};
    this.reasons = _.filter(this.REASONS, (reason: any) => {
      return reason.entity.indexOf(type) !== -1;
    });
    this.modal.open();
    // console.log('testing...........', this);
  }
}
